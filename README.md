# Blockchain Data

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Configuring your project

- Use NPM to initialize your project and create package.json to store project dependencies.
```
npm init
```
- Install crypto-js with --save flag to save dependency to our package.json file
```
npm install crypto-js --save
```
- Install level with --save flag
```
npm install level --save
```

## Testing


#### Project 2 - Build a Private Blockchain

To test code:
1: Open a command prompt or shell terminal after install node.js.
2: Enter a node session, also known as REPL (Read-Evaluate-Print-Loop).
```
node
```
3: Copy and paste your code into your node session
4: Instantiate blockchain with blockchain variable
```
let blockchain = new Blockchain();
```
5: Generate 10 blocks using a for loop
```
for (var i = 0; i <= 10; i++) {
  blockchain.addBlock(new Block("test data "+i));
}
```
6: Validate blockchain
```
blockchain.validateChain();
```
7: Induce errors by changing block data
```
let inducedErrorBlocks = [2,4,7];
for (var i = 0; i < inducedErrorBlocks.length; i++) {
  blockchain.chain[inducedErrorBlocks[i]].data='induced chain error';
}
```
8: Validate blockchain. The chain should now fail with blocks 2,4, and 7.
```
blockchain.validateChain();
```





#### Blockchain Star Notary Service


Node.js
https://nodejs.org/en/


Nodejs Framework used in this project - 

Express.js
https://expressjs.com/

levelDB
Crypto-js
bitcoinjs Message




To run server

> node server.js


### EndPointsm- Using Postman


## Validation Request


#### POST

###### http://localhost:8000/requestValidation


> {"address": "mihLvWMqG8JjKacP6y4NJLoceBdKnP9Jc6"}


##### Response

> {
    "address": "mihLvWMqG8JjKacP6y4NJLoceBdKnP9Jc6",
    "message": "mihLvWMqG8JjKacP6y4NJLoceBdKnP9Jc6:1540672275462:starRegistry",
    "requestTimeStamp": 1540672275462,
    "validationWindow": 300
}



## Message Signature Validation

#### POST

###### http://localhost:8000/message-signature/validate


> {"address": "mihLvWMqG8JjKacP6y4NJLoceBdKnP9Jc6", "signature": "ICXy3qJq8h1GSBqo6oJMGk/JTpuDXYou2ER8qj3Rltf3ZTjGPB8/Be5Huiny8gWIogMbUtTBbKSqZMogZWjGYpM="}


Signing

Address - mihLvWMqG8JjKacP6y4NJLoceBdKnP9Jc6
Message - "mihLvWMqG8JjKacP6y4NJLoceBdKnP9Jc6:1540672275462:starRegistry"

Signature - ICXy3qJq8h1GSBqo6oJMGk/JTpuDXYou2ER8qj3Rltf3ZTjGPB8/Be5Huiny8gWIogMbUtTBbKSqZMogZWjGYpM=

##### Response


> {
    "registerStar": true,
    "status": {
        "address": "mihLvWMqG8JjKacP6y4NJLoceBdKnP9Jc6",
        "message": "mihLvWMqG8JjKacP6y4NJLoceBdKnP9Jc6:1540672275462:starRegistry",
        "requestTimeStamp": 1540672275462,
        "validationWindow": 171,
        "messageSignature": "valid"
    }
}


## Star Registration


#### POST

###### http://localhost:8000/block


> {
    "address": "mihLvWMqG8JjKacP6y4NJLoceBdKnP9Jc6",
    "star": {
      "dec": "02h 31m 49.09s",
      "ra": "+89° 15’ 50.8",
      "story": "Found star using https://www.google.com/sky/"
  }


##### Response

> {
    "hash": "5ada7fa5a87d961b18fc14b4ff539578d38a667d51423c77ec94006519498fc6",
    "height": 1,
    "body": {
        "address": "mihLvWMqG8JjKacP6y4NJLoceBdKnP9Jc6",
        "star": {
            "dec": "02h 31m 49.09s",
            "ra": "+89° 15’ 50.8",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
            "storyDecoded": "Found star using https://www.google.com/sky/"
        }
    },
    "time": "1540674451",
    "previousBlockHash": "cbebba2fe2b9e78de86fa7e7decd611f9b549708a4cb2ff2de73a146df31473d"
}


#### POST


Example:


> curl -v "POST" "http://localhost:8000/block" -H 'Content-Type: application/json' -d $'{"body":"Second Entry"}'

> HTTP/1.1 200 OK
 X-Powered-By: Express
 Content-Type: application/json; charset=utf-8
 Content-Length: 215
 ETag: W/"d7-PpSzZTOCrFohvBN1jqn6yWaVePs"
 Date: Wed, 03 Oct 2018 15:10:59 GMT
 Connection: keep-alive

{
    "hash": "ebe088a2dc36140da06752f4da7b564656e0a4c55b3546ea63dad323ce9c4d41",
    "height": 15,
    "body": "Third Entry",
    "time": "1538579376",
    "previousBlockHash": "ef20173685ed05f058b95d79704119d68af6e7e9abdee419bcfc508ac9950906"
}


