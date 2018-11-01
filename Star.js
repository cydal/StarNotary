//import { DEFAULT_ECDH_CURVE } from 'tls';

const level = require('level');
const chainDB = './data/star';
const db = level(chainDB);
const bitcoinMessage = require("bitcoinjs-message");

const VALIDATION_WINDOW = 300;

/**
 * Star class to handle star functions
 */
class Star {
    constructor() {
        //this.req = req;
    }

    /**
     *  Check address request
     */
    async checkAddressRequest(address) {
        return new Promise((resolve, reject) => {
            db.get(address, (err, value) => {
                if (value === undefined) { 
                    return reject(new Error("Address not found"));
                 } else if (err) {
                     return reject(err);
                 }

                 value = JSON.parse(value);

                 //Time elapsed in seconds
                 const diff = (Date.now() - value.requestTimeStamp) / 1000;
                 
                 if (diff >= VALIDATION_WINDOW) {
                     resolve(this.saveAddressRequest(address));
                 } else {
                     const response = {
                        "address": address, 
                        "message": value.message,
                        "requestTimeStamp": value.requestTimeStamp,
                        "validationWindow": Math.floor(VALIDATION_WINDOW - (Date.now() - value.requestTimeStamp) / 1000)
                     }

                     resolve(response);
                 }
            });
        });
    }
    /**
     *  Save address Request
     */
    async saveAddressRequest(address) {
        return new Promise((resolve, reject) => {
            const response = {
                "address": address,
                "message": address + ":" + Date.now() + ":starRegistry",
                "requestTimeStamp": Date.now(), 
                "validationWindow": VALIDATION_WINDOW
            }
            db.put(response.address, JSON.stringify(response), (err) => {
                if (err) reject(err);
                resolve(response);
            });
            //return data
        });
    }

    /**
     *  Validate message signature
     */
    async validateMessageSignature(address, signature) {
        return new Promise((resolve, reject) => {
            db.get(address, (err, value) => {
                if (value === undefined) { 
                    return reject(new Error("Address not found"));
                 } else if (err) {
                     return reject(err);
                 }

                 value = JSON.parse(value);

                 if (value.messageSignature === 'valid') {
                     return resolve({
                         registerStar: true,
                         status: value
                     });
                 } else {

                    //Time elapsed in seconds
                    const diff = (Date.now() - value.requestTimeStamp) / 1000;
                    
                    if (diff >= VALIDATION_WINDOW) {
                        value.validationWindow = 0;
                        value.messageSignature = "Window has expired";
                    } else {
                        value.validationWindow = Math.floor(VALIDATION_WINDOW - (Date.now() - value.requestTimeStamp) / 1000);

                        let isValid = false;
                        try {
                            isValid = bitcoinMessage.verify(value.message, address, signature);
                        } catch (err) {
                            isValid = false;
                        }

                        if (isValid) {
                            value.messageSignature = "valid";
                        } else {
                            value.messageSignature = "invalid";
                        }
                    }

                    db.put(address, JSON.stringify(value));

                    return resolve({
                        registerStar: !diff >= VALIDATION_WINDOW && isValid,
                        status: value
                    });

                }
            });
        });
    }

    /**
     *  Check address on system
     */
    async isValid(req) {
        return new Promise((resolve, reject) => {
            db.get(req.body.address, (err, value) => {
                
                if (value === undefined) {
                    return reject(new Error("Address not authorized"));
                } else if (err) {
                    return reject(err);
                }

                value = JSON.parse(value);

                return value.messageSignature === 'valid';
            })
        });
    }

    /**
     *  Remove Address
     */
    remove(address) {
        db.del(address);
    }
}

module.exports = {
    "Star": Star
}