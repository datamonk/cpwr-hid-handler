const col = require('yoctocolors');

function splitBufferIntoChunks(buffer, chunkSize) {
  const chunks = [];
  for (let i = 0; i < buffer.length; i += chunkSize) {
    chunks.push(buffer.slice(i, i + chunkSize));
  };
  return chunks;
};

var JSONstringifyRaw = function(arr) {
  var str='<Buffer ';
  for (var i = 0; i < arr.length-1; i++) {
    str += arr[i].toString(16).padStart(2, '0');
    if(i<arr.length-2) { str+=' '; }
  };
  str += '>';
  str = col.magentaBright(str);
  return str;
};

var JSONstringifyHex = function(arr) {
  var str='[';
  for (var i = 0; i < arr.length-1; i++) {
    str += '0x' + arr[i].toString(16).padStart(2, '0');
    if(i<arr.length-2) { str+=', '; }
  }
  str += ']';
  str = col.cyanBright(str);
  return str;
};

module.exports = {
    splitBufferIntoChunks,
    JSONstringifyRaw,
    JSONstringifyHex
};