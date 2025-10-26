
const { deriveChargeStatus } = require('./derive-charge-status.js');

describe('deriveChargeStatus(): Derive charge status from boolean states', () => {

  beforeAll(() => {
    //
  });

  afterAll(() => {
    //
  });

  beforeEach(() => {
    //
  });
  
  afterEach(() => {
    //
  });

  test('should derive "fully-charged" status', () => {
    const result = deriveChargeStatus(true, false, false, true);
    expect(result).toBe('fully-charged');
  });

  test('should derive "charging" status', () => {
    const result = deriveChargeStatus(true, true, false, false);
    expect(result).toBe('charging');
  });

  test('should derive "discharging" status', () => {
    const result = deriveChargeStatus(false, false, true, false);
    expect(result).toBe('discharging');
  });

  test('should derive "undefined" status for unknown states', () => {
    const result = deriveChargeStatus(false, false, false, false);
    expect(result).toBe('undefined');
  });

});