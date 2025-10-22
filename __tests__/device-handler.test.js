// __tests__/device-handler.test.js

import { KEYBOARD_DATA, KEYBOARD_DEVICE } from './__fixtures__/keyboard-data';
import { GAMEPAD_DATA, GAMEPAD_DEVICE } from './__fixtures__/gamepad-data';

// Your application's device handler class
import DeviceHandler from '../src/device-handler';

// Important: Tell Jest to use the manual mock
jest.mock('node-hid');
import HID from 'node-hid';

describe('DeviceHandler', () => {
  let deviceHandler;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should handle keyboard key presses', async () => {
    // Create an instance of the HID class from the mock
    const keyboardHid = new HID.HID(KEYBOARD_DEVICE.vendorId, KEYBOARD_DEVICE.productId);
    deviceHandler = new DeviceHandler(keyboardHid);

    const keypressHandler = jest.fn();
    deviceHandler.on('keypress', keypressHandler);

    // Simulate a keypress event from the mocked HID device
    keyboardHid._simulateData(KEYBOARD_DATA.KEY_A_PRESS);

    // Assert that the handler was called with the correct data
    expect(keypressHandler).toHaveBeenCalledWith(KEYBOARD_DATA.KEY_A_PRESS);
  });

  it('should handle gamepad button presses', async () => {
    const gamepadHid = new HID.HID(GAMEPAD_DEVICE.vendorId, GAMEPAD_DEVICE.productId);
    deviceHandler = new DeviceHandler(gamepadHid);

    const buttonPressHandler = jest.fn();
    deviceHandler.on('button-press', buttonPressHandler);

    // Simulate a button press from the mocked HID device
    gamepadHid._simulateData(GAMEPAD_DATA.BUTTON_1_DOWN);

    expect(buttonPressHandler).toHaveBeenCalledWith(GAMEPAD_DATA.BUTTON_1_DOWN);
  });

  it('should handle HID device errors', async () => {
    const keyboardHid = new HID.HID(KEYBOARD_DEVICE.vendorId, KEYBOARD_DEVICE.productId);
    deviceHandler = new DeviceHandler(keyboardHid);

    const errorHandler = jest.fn();
    deviceHandler.on('error', errorHandler);
    const mockError = new Error('Device disconnected');

    // Simulate an error event
    keyboardHid._simulateError(mockError);

    expect(errorHandler).toHaveBeenCalledWith(mockError);
  });
});