var fs = require('fs');
var my_marked = require('marked');
var writeFile = require('write');
var filename = 'marked.html';
var output = 'output.html';

fs.readFile(filename, function (error, buffer) {
  if (error) {
    console.error(error.message);
    return;
  }
  var file = buffer.toString();
  my_marked.setOptions({
    renderer: new my_marked.Renderer(),
    highlight: function(code) {
    return require('highlight.js').highlightAuto(code).value;
  }
  });
    var newText = my_marked(file);
    fs.writeFile(output, newText, function (error) {
            if (error) {
                console.error(error.message);
                return;
  }
                console.log('File Save: ', output);
        });
  });