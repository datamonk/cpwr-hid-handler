### HID Parsing Notes

```bash
# Raw Buffer Iteration Sample (SL950U)
<Buffer 66 00 85 00 64 00 00 00 30 00 84 00 8c 00 00 00>
<Buffer 68 00 85 00 dd 09 00 00>
<Buffer d0 00 85 00 01 00 00 00 44 00 85 00 00 00 00 00 45 00 85 00 00 00 00 00 46 00 85 00 01 00 00 00 43 00 85 00 00 00 00 00 42 00 85 00 00 00 00 00>
<Buffer 30 00 84 00 76 00 00 00 30 00 84 00 76 00 00 00>
<Buffer 35 00 84 00 0e 00 00 00>
<Buffer 65 00 84 00 00 00 00 00>
<Buffer 9e 00 01 ff 00 00 00 00>
<Buffer 5a 00 84 00 01 00 00 00>
<Buffer 2a 00 85 00 2c 01 00 00>
<Buffer 58 00 84 00 00 00 00 00>
<Buffer 57 00 84 00 ff ff ff ff>
<Buffer 56 00 84 00 ff ff ff ff>
<Buffer 40 00 84 00 78 00 00 00>

# Mapping
<Buffer 66 00 85 00 64 00 00 00 30 00 84 00 8c 00 00 00>
- 66 (1): Remaining Capacity - Value Bytes [4-5]
- 30 (2): Reserved - Value Byte [12] (Ignore)

<Buffer 68 00 85 00 dd 09 00 00>
- 68 (1): Run Time To Empty - Value Bytes [4-5]

<Buffer d0 00 85 00 01 00 00 00 44 00 85 00 00 00 00 00 45 00 85 00 00 00 00 00 46 00 85 00 01 00 00 00 43 00 85 00 00 00 00 00 42 00 85 00 00 00 00 00>
- d0 (1): AC Present - Value Byte [4]
- 44 (2): Charging - Value Byte [12]
- 45 (3): Discharging - Value Byte [20]
- 46 (4): Fully Charged - Value Byte [28]
- 43 (5): Remaining Time Limit Expired - Value Byte [36] (Ignore)
- 42 (6): Below Remaining Capacity Limit - Value Byte [44] (Ignore)

<Buffer 30 00 84 00 76 00 00 00 30 00 84 00 76 00 00 00>
- 30 (1): Reserved - Value Byte [4] (Ignore)
- 30 (2): Reserved - Value Byte [12] (Ignore)

<Buffer 35 00 84 00 0e 00 00 00>
- 35 (1): Reserved - Value Byte [4] (Ignore)

<Buffer 65 00 84 00 00 00 00 00>
- 65 (1): Absolute State Of Charge [4] (Ignore)

<Buffer 9e 00 01 ff 00 00 00 00>
- 9e (1): Reserved - Value Byte [4] (Ignore)

<Buffer 5a 00 84 00 01 00 00 00>
- 5a (1): Reserved - Value Byte [4] (Ignore)

<Buffer 2a 00 85 00 2c 01 00 00>
- 2a (1): Remaining Time Limit - Value Byte [4-5] (Ignore)

<Buffer 58 00 84 00 00 00 00 00>
- 58 (1): Reserved - Value Byte [4] (Ignore)

<Buffer 57 00 84 00 ff ff ff ff>
- 57 (1): Reserved - Value Byte [4] (Ignore)

<Buffer 56 00 84 00 ff ff ff ff>
- 56 (1): Reserved - Value Byte [4] (Ignore)

<Buffer 40 00 84 00 78 00 00 00>
- 40 (1): Terminate Charge - Value Byte [4-5] (Ignore)
```

```bash
# Raw Buffer Iteration Sample (CP1500PFCRM2U)
<Buffer 66 00 85 00 64 00 00 00 68 00 85 00 80 0c 00 00 2a 00 85 00 2c 01 00 00>
<Buffer d0 00 85 00 01 00 00 00 44 00 85 00 00 00 00 00 45 00 85 00 00 00 00 00 42 00 85 00 00 00 00 00 46 00 85 00 01 00 00 00 43 00 85 00 00 00 00 00>
<Buffer 34 00 84 00 98 00 00 00>
<Buffer 33 00 84 00 98 00 00 00>

# Mapping
<Buffer 66 00 85 00 64 00 00 00 68 00 85 00 80 0c 00 00 2a 00 85 00 2c 01 00 00>
- 66 (1): Remaining Capacity - Value Bytes [4-5]
- 68 (2): Run Time To Empty - Value Bytes [12-13]
- 2a (3): Remaining Time Limit - Value Byte [20-21] (Ignore)

<Buffer d0 00 85 00 01 00 00 00 44 00 85 00 00 00 00 00 45 00 85 00 00 00 00 00 42 00 85 00 00 00 00 00 46 00 85 00 01 00 00 00 43 00 85 00 00 00 00 00>
- d0 (1): AC Present - Value Byte [4]
- 44 (2): Charging - Value Byte [12]
- 45 (3): Discharging - Value Byte [20]
- 42 (4): Below Remaining Capacity Limit - Value Byte [28] (Ignore)
- 46 (5): Fully Charged - Value Byte [36]
- 43 (6): Remaining Time Limit Expired - Value Byte [44] (Ignore)

<Buffer 34 00 84 00 98 00 00 00>
- 34 (1): Reserved (Ignore)

<Buffer 33 00 84 00 98 00 00 00>
- 33 (2): Reserved (Ignore)
```

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