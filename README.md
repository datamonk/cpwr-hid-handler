<!-- Styling brackets in native markdown works but can run into compatibility issues.
     It's more reliable to user HTML directly for images.
  ![flux capacitor](./assets/batt_icon_256px.png){height=150}
  -->
# CyberPower USB-HID Handler (cpwr-hid-handler)

<img src="./assets/batt_icon_256px.png" align="right" alt="battery tilted" height="150" style="padding: 10px;">

NodeJS based helper functions using the [`node-hid`](https://github.com/node-hid/node-hid) module to read, parse, convert and return stat values in JSON for personal Cyberpower UPS devices. This repo was created for use as a sub-module for another parent project to exclusivly READ data. So the codebase is fairly minimal and not intended as a complete API abstraction for `node-hid`.

## Tested Devices

Development and testing was performed directly against the following `Cyber Power System, Inc` UPS devices:

* [CP1500PFCRM2U](https://www.cyberpowersystems.com/product/ups/pfc-sinewave/cp1500pfcrm2u/)
* [SL950U](https://www.cyberpowersystems.com/product/ups/standby/sl950u/)
* [SL750U](https://www.cyberpowersystems.com/product/ups/battery-backup/sl750u/)
* [SX650U](https://www.cyberpowersystems.com/product/ups/battery-backup/sx650u/)

## Usage

```bash
# opts
./bin/read-ups --mode [once|stream] [--report] [--verbose]

# example
./bin/read-ups --mode once --verbose

# ----- Running [read-ups.js] at Mon 13 Oct 2025 11:28:36 AM EDT -----
#
#   [VERBOSE] Verbose mode enabled.
#   [VERBOSE] Starting UPS HID handler...
#   [VERBOSE] Looking for device with Vendor ID 0x764 and Product ID 0x501...
#   [VERBOSE] Opened device: /dev/usb/hiddev0
#   [VERBOSE] Listening for data... Press Ctrl+C to exit.
#   {
#     "ts": "2025-10-13T15:28:42.768Z",
#     "path": "/dev/usb/hiddev0",
#     "batteryPercentage": 100,
#     "acPresent": true,
#     "runTimeToEmpty": 42,
#     "chargeStatus": "fully-charged"
#   }
#   [VERBOSE] Closed device after single read cycle.
```

## Deployment

### Bootstrap

```bash
git clone https://github.com/datamonk/cpwr-hid-handler.git \
 && cd cpwr-hid-handler/

# installs 'node-hid yoctocolors' modules
npm install
```

### Setting udev rules for non-sudo exec

```bash
# Identify device product & vendor ids if not done so already.
./utils/find_hid_ids.sh "Cyber Power"

# Create new udev rule file
sudo vim /etc/udev/rules.d/99-ups-hid.rules

## Paste the below block
SUBSYSTEM=="input", GROUP="input", MODE="0666"
SUBSYSTEM=="usb", ATTRS{idVendor}=="0764", ATTRS{idProduct}=="0501", MODE="0666", GROUP="plugdev"
KERNEL=="hiddev*", ATTRS{idVendor}=="0764", ATTRS{idProduct}=="0501", MODE="0666", GROUP="plugdev"
KERNEL=="hidraw*", ATTRS{idVendor}=="0764", ATTRS{idProduct}=="0501", MODE="0666", GROUP="plugdev"
## :wq

# Propagate changes
sudo udevadm control --reload-rules && sudo udevadm trigger

# Confirm matching perms and group
find /dev -regex '.*hid.*' -type c -group plugdev -exec ls -la {} +

#  crw-rw-rw- 1 root plugdev 239, 1 Oct 10 12:57 /dev/hidraw1
#  crw-rw-rw- 1 root plugdev 180, 0 Oct 10 12:57 /dev/usb/hiddev0
```