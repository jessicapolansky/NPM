var fs = require('fs-promise');

var input1 = 'cat1.html';
var input2 = 'cat2.html';
var output = 'output.html';
var p1 = fs.readFile(input1);
var p2 = fs.readFile(input2);
console.log(p1);
Promise.all([p1, p2])
    .then(function (responses) {
        var total = (responses[0] + " " + responses[1]);
        console.log(total);
        return total;
    })
    .then(function (total) {
        fs.writeFile(output, total, function (error) {
            if (error) {
                console.error(error.message);
                return;
            }})});

