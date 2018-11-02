
const Blockchain = require('./simpleChain.js').Blockchain;
let Blck = require('./simpleChain.js').Block;

const Star = require("./Star.js").Star;
const express = require('express');

const app = express();
const port = 8000;

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Max bytes for story
const MAX_STORY = 500;



app.listen(port, () => {
    console.log('App listening on port ' + port);
});


/** 
//Mock blockchain data
let mockChain = {
    '0': { "height": 0, 'time': '6.30pm', 'hash': 3001020}, 
    '1': { "height": 1, 'time': '6.40pm', 'hash': 3001234}
};
*/


let blockchain = new Blockchain();

const validateAddress = (req) => {

    if (!req.body.address) {
        //if body empty or no body - 400 Bad Request
        res.status(400).json({
            "status": 400,
            "message": "Must contain address parameter"
        });
     }
};


const validateSignature = (req) => {
    
    if (!req.body.signature) {
        //if body empty or no body - 400 Bad Request
        res.status(400).json({
            "status": 400,
            "message": "Must contain signature parameter"
        });
     }
};

const validateStarRequest = (req) => {
    const { star } = req.body;
    const {dec, ra, story } = star;
   
    validateAddress(req);
   
    if (!req.body.star) {
       throw new Error("Fill in star parameters please");
    }
   
   // string check
   if (typeof dec !== 'string' || typeof ra !== 'string' || typeof story !== 'string') {
       throw new Error("Star information must be of type string");
   }
   
   // not-empty check
   if ( !dec.length || !ra.length || !story.length) {
       throw new Error("Star information must not be empty");
   }

   //ascii check
   if (!/^[\x00-\x7F]*$/.test(story)) {
       throw new Error("Story must only contain ASCII ccharaters");
   }

   //Check story does not exceed 500bytes
   if (new Buffer(story).length > MAX_STORY) {
       throw new Error("Story must not exceed 500bytes");
   }
}

app.get('/block/:height', async (req, res) => {
    
    try {
        const height = req.params.height;
        const block = await blockchain.getBlock(height);
        //console.log(block);
        res.send(block);
    } catch(err) {
        res.status(404).json({
            "status": 404,
            "message": "Incorrect Block Height"
        });
    }
    //res.send(req.url);
    //res.send(JSON.stringify(mockChain[0]));
});

app.get('/stars/address:address', async (req, res) => {
    
    try {
        const address = req.params.address.slice(1);
        const response = await blockchain.getBlockByAddress(address);

        res.send(response);
    } catch(err) {
        res.status(404).json({
            "status": 404,
            "message": err.message + " -  Address not found"
        });
    }
    //res.send(req.url);
    //res.send(JSON.stringify(mockChain[0]));
});

app.get('/stars/hash:hash', async (req, res) => {
    
    try {
        const hash = req.params.hash.slice(1);
        const block = await blockchain.getBlockByHash(hash);
        res.send(block);
    } catch(err) {
        res.status(404).json({
            "status": 404,
            "message": "Hash not found"
        });
    }
    //res.send(req.url);
    //res.send(JSON.stringify(mockChain[0]));
});


app.post('/block', async (req, res) => {

    validateStarRequest(req);

    const starValidation = new Star();

    try {

        const valid = await starValidation.isValid(req);

        
        if (!valid) {
            throw new Error("Signature is invalid");
        }

    } catch(err) {
        res.status(401).json({
            "status": 400,
            "message": "Block Error - " + err.message
        });

        return
    }


    const body = req.body;
    const { address, star } = req.body ;

    body.star.story = new Buffer(star.story).toString('hex');


    let height = await blockchain.getChainHeight();


    await blockchain.addBlock(new Blck(body));

    height = await blockchain.getChainHeight();
    const response = await blockchain.getBlock(height);

    starValidation.remove(address);

    res.send(response);

    //console.log(JSON.stringify(response));
    //res.send(JSON.stringify(response));
});


app.post('/requestValidation', async (req, res) => {

    validateAddress(req);

    const address = req.body.address;
    const starValidation = new Star();

    try {
        response = await starValidation.checkAddressRequest(address);
    } catch (err) {
        response = await starValidation.saveAddressRequest(address);
    }

    res.send(response);

    //console.log(JSON.stringify(response));
    //res.send(JSON.stringify(response));
});



app.post('/message-signature/validate', async (req, res) => {

    validateAddress(req);
    validateSignature(req);

    const starValidation = new Star();

    try {
        const {address, signature } = req.body;
        const response = await starValidation.validateMessageSignature(address, signature);

        response.registerStar ? res.send(response) : res.status(401).json(response);

    } catch (err) {
            res.status(404).json({
           "status": 404,
           "message": err.message
       });
    }

    //console.log(JSON.stringify(response));
    //res.send(JSON.stringify(response));
})