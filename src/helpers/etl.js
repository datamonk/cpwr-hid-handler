const col = require('yoctocolors');

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
  let chargeStatus;
  //let acPresent = false;
  //let charging = false;
  //let discharging = false;
  //let fullyCharged = false;
  const states = {
    acPresent: acPresent,
    charging: charging,
    discharging: discharging,
    fullyCharged: fullyCharged
  };
  //logger.debug('Evaluating charge states:', states);
  if (fullyCharged && acPresent) {
    chargeStatus = "fully-charged";
  } else if (charging && acPresent) {
    chargeStatus = "charging";
  } else if (discharging && !acPresent) {
    chargeStatus = "discharging";
  } else {
    chargeStatus = "undefined"; // Catch all remaining unknown states
  };
  //logger.debug('Derived charge status:', col.bold(`${chargeStatus}`));
  return chargeStatus;
};

module.exports = {
    splitBufferIntoChunks,
    JSONstringifyRaw,
    JSONstringifyHex,
    deriveChargeStatus,
    sortObjectElements
};