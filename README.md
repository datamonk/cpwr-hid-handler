<!-- Styling brackets in native markdown works but can run into compatibility issues.
     It's more reliable to user HTML directly for images.
  ![flux capacitor](./assets/batt_icon_256px.png){height=150}
  -->
# CyberPower USB-HID Handler (cpwr-hid-handler)

<img src="./assets/batt_icon_256px.png" align="right" alt="battery tilted" height="150" style="padding: 10px;">

NodeJS based helper functions using the [`node-hid`](https://github.com/node-hid/node-hid) module to read, parse, convert and return stat values in JSON for personal Cyberpower UPS devices. This repo was created for use as a sub-module for another parent project to exclusivly READ data. So the codebase is fairly minimal and not intended as a complete API abstraction for `node-hid`.

## Scope

TODO

## Tested Devices

Development and testing was performed directly against the following `Cyber Power System, Inc` UPS devices:

* [CP1500PFCRM2U](https://www.cyberpowersystems.com/product/ups/pfc-sinewave/cp1500pfcrm2u/)
* [SL950U](https://www.cyberpowersystems.com/product/ups/standby/sl950u/)
* [SL750U](https://www.cyberpowersystems.com/product/ups/battery-backup/sl750u/)
* [SX650U](https://www.cyberpowersystems.com/product/ups/battery-backup/sx650u/)

### Bootstrap

```bash
cd cpwr-hid-handler/
npm install node-hid
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
```