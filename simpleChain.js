


const utils = require('./levelUtils');


/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');


/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain {
  constructor(){

    this.getChainHeight().then((height) => {
      if (height === -1) {
        this.addBlock(new Block("First block in the chain - Genesis block"));
        console.log("Added Genesis Block");
      }
    });
  }

  // Add new block
  async addBlock(newBlock){
    // Block height

    let height = await this.getChainHeight();
    newBlock.height = height + 1;

    //console.log(height);
    //console.log(newBlock.height);


    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    // previous block hash
    if(newBlock.height>0){
      const prevBlock = await utils.getBlock(newBlock.height - 1);
      console.log(typeof prevBlock);
      console.log(prevBlock);
      newBlock.previousBlockHash = prevBlock.hash;

    }
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    // Adding block object to chain
    //this.chain.push(newBlock);
    
    await utils.addBlock(newBlock.height, JSON.stringify(newBlock));

    console.log("Added Block # " + newBlock.height);

  }

  // Get block height
    async getChainHeight(){
      return await utils.getHeight();
    }

    // get block by height
    async getBlock(blockHeight){
      // return object as a single string
      let block = await utils.getBlock(blockHeight);
      return block;
    }

    // get block by address
    async getBlockByAddress(address) {
      // return object as a single string
      const block = await utils.getByAddress(address);
      return block;
    }


    // get block by hash
    async getBlockByHash(hash) {
      // return object as a single string
      let block = await utils.getByHash(hash);
      return block;
    }

    async getChain() {
      let chain = await utils.getChain();
      return chain;
    }

    // validate block
    async validateBlock(blockHeight){
      // get block object
      let block = await utils.getBlock(blockHeight);
      // get block hash
      let blockHash = block.hash;
      // remove block hash to test block integrity
      block.hash = '';
      // generate block hash
      let validBlockHash = SHA256(JSON.stringify(block)).toString();
      // Compare
      if (blockHash===validBlockHash) {
          return true;
        } else {
          console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
          return false;
        }
    }

   // Validate blockchain
    async validateChain(){
      let errorLog = [];
      let chain = await utils.getChain();
      for (var i = 0; i < chain.length-1; i++) {
        // validate block
        if (!this.validateBlock(i))errorLog.push(i);
        // compare blocks hash link
        let blockHash = chain[i].hash;
        let previousHash = chain[i+1].previousBlockHash;
        if (blockHash!==previousHash) {
          errorLog.push(i);
        }
      }
      if (errorLog.length>0) {
        console.log('Block errors = ' + errorLog.length);
        console.log('Blocks: '+errorLog);
      } else {
        console.log('No errors detected');
      }
    }
}



module.exports = {"Blockchain": Blockchain, "Block": Block};

/** 
let blockchain = new Blockchain();



for (let i = 0; i < 10; i++) {
  blockchain.addBlock(new Block("New Block " + i));
}

setTimeout(function() {
  blockchain.validateChain();
}, 1000)


*/