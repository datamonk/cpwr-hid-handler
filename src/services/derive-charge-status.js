//const logger = require('../../lib/logger.js');

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

module.exports = { deriveChargeStatus };