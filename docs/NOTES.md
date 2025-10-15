### HID Parsing Notes

```bash
# @ref: https://github.com/kastaniotis/Sups/blob/master/Sups/src/Sensor/HIDUpsSensor.cs

./sups --debug --port /dev/usb/hiddev0 --pretty-json
Logging is now: True
Json is now: False
PrettyJson is now: True
Port was specified in arguments: /dev/usb/hiddev0
Local Monitoring is now: False
Remote Monitoring: False
Trying to read device at: /dev/usb/hiddev0
Sensor reading: /dev/usb/hiddev0
Received: 66-00-85-00-64-00-00-00
Charge: 100
Received: 68-00-85-00-AC-0D-00-00
Time: 58
Received: 2A-00-85-00-2C-01-00-00
Ignored: 2A: 2C-01
Received: D0-00-85-00-01-00-00-00
AcPresent: True
Received: 44-00-85-00-00-00-00-00
Charging: False
Received: 45-00-85-00-00-00-00-00
Discharging: False
Received: 42-00-85-00-00-00-00-00
Ignored: 42: 00-00
Received: 46-00-85-00-01-00-00-00
Full: True
Snapshot is now Complete: Iconic.Sups.Snapshot
Device Status is now: Fully Charged
Printing Out Pretty Json: Iconic.Sups.Snapshot
{
    "Date": "2025-10-14T23:21:49",
    "Port": "/dev/usb/hiddev0",
    "Charge": 100,
    "ACPresent": true,
    "Time": 58,
    "ChargerStatus": "Fully Charged",
    "ShutdownThreshold": 50,
    "Monitoring": false,
    "RemoteMonitoring": ""
}
```