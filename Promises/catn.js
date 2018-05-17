var fs = require('fs-promise');


var output = 'output.html';
var filenames = ['cat1.html', 'cat2.html', 'cat3.html'];
const allTheFiles = (filenames)=>{
     return new Promise((resolve, reject)=>{
        var data = [];
        for (var i = 0; i < filenames.length; i++) {
            var input = filenames[i];
            var newFile = fs.readFile(input);
            data.push(newFile);
        }
        console.log( data)
        .then(()=>{
        })
        .catch(error=>{
            return reject('Error: ', error);
        });
    })};

Promise.all(allTheFiles(filenames))
    .then(function (data) {
        fs.writeFile(output, data, function (error) {
            console.log("Files written to output");
        })
    .catch(function(error) {
        console.log("error:", error);
            })});