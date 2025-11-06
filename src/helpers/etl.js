
var JSONstringifyRaw = function(arr) {
  const { magentaBright } = require('yoctocolors');
  var str='<Buffer ';
  for (var i = 0; i < arr.length-1; i++) {
    str += arr[i].toString(16).padStart(2, '0');
    if(i<arr.length-2) { str+=' '; }
  };
  str += '>';
  str = magentaBright(str);
  return str;
};
// ${JSONstringifyRaw(chunk)}

var JSONstringifyHex = function(arr) {
  const { cyanBright } = require('yoctocolors');
  var str='[';
  for (var i = 0; i < arr.length-1; i++) {
    str += '0x' + arr[i].toString(16).padStart(2, '0');
    if(i<arr.length-2) { str+=', '; }
  }
  str += ']';
  str = cyanBright(str);
  return str;
};
// ${JSONstringifyHex(chunk)}

function splitBufferIntoChunks(buffer, chunkSize) {
  const chunks = [];
  for (let i = 0; i < buffer.length; i += chunkSize) {
    chunks.push(buffer.slice(i, i + chunkSize));
  };
  return chunks;
};

function sortObjectElements(inputObject, keyOrder) {
  const entries = Object.entries(inputObject);
  entries.sort((a, b) => {
    const indexA = keyOrder.indexOf(a[0]);
    const indexB = keyOrder.indexOf(b[0]);
    return indexA - indexB;
  });
  const sortedObject = Object.fromEntries(entries);
  return sortedObject;
};

function deriveChargeStatus(acPresent, charging, discharging, fullyCharged) {
  let status;
  const states = {
    acPresent: acPresent,
    charging: charging,
    discharging: discharging,
    fullyCharged: fullyCharged
  };
  //logger.debug('Evaluating charge states:', states);
  if (fullyCharged && acPresent) {
    status = "fully-charged";
  } else if (charging && acPresent) {
    status = "charging";
  } else if (discharging && !acPresent) {
    status = "discharging";
  } else {
    status = "undefined"; // Catch all remaining unknown states
  };
  //logger.debug('Derived charge status:', col.bold(`${chargeStatus}`));
  return status;
};

module.exports = {
    splitBufferIntoChunks,
    JSONstringifyRaw,
    JSONstringifyHex,
    deriveChargeStatus,
    sortObjectElements
};