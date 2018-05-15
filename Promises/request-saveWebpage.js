const rp = require('request-promise');
const fs = require('fs-extra');
const url = 'https://en.wikipedia.org/wiki/Futures_and_promises';
const filename = 'test.html';

const saveWebPage = (url, filename, )=>{
    return new Promise((resolve, reject)=>{
        const rpOptions = {
            method: 'GET',
            uri: url
        };
        rp(rpOptions)
        .then(body=>{
            console.log("Success");
            return fs.outputFile(filename, body);
        })
        .then(()=>{
            return resolve(true);
        })
        .catch(error=>{
            return reject(error);
        });
    });
}



saveWebPage(url, filename)
    // .then(results=>{
    
    // })
    // .catch(error=>{
    
    // });