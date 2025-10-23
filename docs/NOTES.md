<!-- Per usual, CSS compatibility beyond the most basic
     use comes down to 'it depends'. To avoid that rabbit
     hole for now, im just going to apply sytling inline
     with the content... :| -->
<style>
mark { background-color: #FBEC5D; }
.hi-gre { background-color: #aaeebb; }
.hi-red { background-color: #ff0000; }
.hi-ora { background-color: #FF7518; }
</style>

# HID Parsing Breakdown

- [Implementation](#implementation)
- [How To's](#how-tos)
- [Usage Lookup Table](#usage-lookup-table)
- Device Parsing: `CP1500PFCRM2U`
  - [Buffer HID Mapping `CP1500PFCRM2U`](#buffer-hid-mapping-cp1500pfcrm2u)
  - [Descriptors `CP1500PFCRM2U`](#descriptors-cp1500pfcrm2u)
- Device Parsing: `SL950U`
  - [Buffer HID Mapping `SL950U`](#buffer-hid-mapping-sl950u)
  - [Descriptors `SL950U`](#descriptors-sl950u)
- [References](#references)

<!-- toc -->

## Implementation

TODO

## How To's

<details open>

<summary><b>Generating the Descriptor Report</b></summary>

<br/>

There are several common methods to retrieve a descriptor report based on HID input. The following was used to generate any included with this doc:

1. First, identify the used device path (likely `/dev/usb/hiddev0`)

```bash
$ cat /sys/bus/hid/devices/0003:0764:0501.0002/report_descriptor | od -tx1 -Anone

# @output
  05 84 09 04 a1 01 09 24 a1 00 85 1d 09 fe 75 08
  95 01 15 00 26 ff 00 b1 22 85 03 09 fd b1 22 05
# ...
```
2. Copy the path and navigate to https://eleccelerator.com/usbdescreqparser/

3. Paste the entire value block within the `Input` field of the page's form. Select the [USB HID Report Descriptor] button from the `Parse as...` section below.

4. The report should populate in the `Output` field.

</details>

## Usage Lookup Tables

### <p><span style="background-color: Green;">Used / Parsed</span></p>

|  Usage ID | Usage Name | Usage Desc. | Unit |
| :-------- | :--------: | :---------: | ---: |
| *0xXX [^XX]* | *{name}* | *{sec} - {desc}*  | *{unit}* |
| `0xd0` | AC Present | Sec. 31.7 [Charger Status] - AC Power Present/Not Present | Bool [0/1] |
| `0x44` | Charging | Sec. 31.7 [Charger Status] - Is battery charging. | Bool [0/1] |
| `0x45` | Discharging | Sec. 31.7 [Charger Status] - Is battery discharging. | Bool [0/1] |
| `0x46` | Full Charged | Sec. 31.7 [Charger Status] - Is battery fully charged. | Bool [0/1] |
| `0x66` | Remaining Capacity | Sec. 31.4 [Battery Measures] - The predicted remaining capacity.  | Int [% 0-100] |
| `0x68` | Run Time To Empty | Sec. 31.4 [Battery Measures] - The predicted remaining battery life. | Int [seconds] |

### <p><span style="background-color: Red;">Ignored</span> `but emitted`</p>

The below listing of usages have been seen at some point in the raw buffer output regardless of device type. All of them are currently ignored but could be evaluated further for integration.

|  Usage ID | Usage Name | Usage Desc. | Unit |
| :-------- | :--------: | :---------: | ---: |
| *0xXX [XX]* | *{name}* | *{sec} - {desc}*  | *{unit}* |
| `0x2a` | Remaining Time Limit | - | - |
| `0x30` | Reserved | - | - |
| `0x33` | Reserved | - | - |
| `0x34` | Reserved | - | - |
| `0x35` | Manufacturer String | {sec} - The device vendor name. | Str |
| `0x40` | Terminate Charge Voltage | ? | Sel |
| `0x42` | Below Remaining Capacity Limit | ? | ? |
| `0x43` | Remaining Time Limit Expired | ? | ? |
| `0x5a` | Reserved | - | - |
| `0x56` | Reserved | - | - |
| `0x57` | Reserved | - | - |
| `0x58` | Reserved | - | - |
| `0x65` | Absolute State of Charge | ? | Int [?] |
| `0x9e` | Reserved | - | - |

## Buffer HID Mapping `CP1500PFCRM2U`

### Full Read Cycle Iteration

> *Event Index Length:* `3`

```
<Buffer 66 00 85 00 64 00 00 00 68 00 85 00 80 0c 00 00 2a 00 85 00 2c 01 00 00>
<Buffer d0 00 85 00 01 00 00 00 44 00 85 00 00 00 00 00 45 00 85 00 00 00 00 00 42 00 85 00 00 00 00 00 46 00 85 00 01 00 00 00 43 00 85 00 00 00 00 00>
<Buffer 34 00 84 00 98 00 00 00>
<Buffer 33 00 84 00 98 00 00 00>
```

<hr />
<br />

### Per Event Usage Mapping `split by 8-byte sets`

> *Index:* `0` | *Byte Length:* `24`

`<Buffer 66 00 85 00 64 00 00 00 68 00 85 00 80 0c 00 00 2a 00 85 00 2c 01 00 00>`

- 66 (1): Remaining Capacity[^66] - Value Bytes [4-5]
- 68 (2): Run Time To Empty - Value Bytes [12-13]
- 2a (3): ~~Remaining Time Limit - Value Byte [20-21]~~ <mark>Ignore</mark>

<hr />

> *Index:* `1` | *Byte Length:* `48`

`<Buffer d0 00 85 00 01 00 00 00 44 00 85 00 00 00 00 00 45 00 85 00 00 00 00 00 42 00 85 00 00 00 00 00 46 00 85 00 01 00 00 00 43 00 85 00 00 00 00 00>`
- d0 (1): AC Present - Value Byte [4]
- 44 (2): Charging - Value Byte [12]
- 45 (3): Discharging - Value Byte [20]
- 42 (4): ~~Below Remaining Capacity Limit - Value Byte [28]~~ <mark>Ignore</mark>
- 46 (5): Fully Charged - Value Byte [36]
- 43 (6): ~~Remaining Time Limit Expired - Value Byte [44]~~ <mark>Ignore</mark>

<hr />

> *Index:* `2` | *Byte Length:* `8`

`<Buffer 34 00 84 00 98 00 00 00>`
- 34 (1): ~~Reserved~~ <mark>Ignore</mark>

<hr />

> *Index:* `3` | *Byte Length:* `8`

`<Buffer 33 00 84 00 98 00 00 00>`
- 33 (2): ~~Reserved~~ <mark>Ignore</mark>

<hr />

### Descriptors `CP1500PFCRM2U`

```yaml

TODO

```

## Buffer HID Mapping `SL950U`

### Full Read Cycle Iteration

> *Event Index Length:* `12`

```
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
```

<hr />
<br />

### Per Event Usage Mapping `split by 8-byte sets`

> *Index:* `0` | *Byte Length:* `16`

`<Buffer 66 00 85 00 64 00 00 00 30 00 84 00 8c 00 00 00>`

- 66 (1): Remaining Capacity[^66] - Value Bytes [4-5]
- 30 (2): ~~Reserved - Value Byte [12]~~ <mark>Ignore</mark>

<hr />

> *Index:* `1` | *Byte Length:* `8`

`<Buffer 68 00 85 00 dd 09 00 00>`

- 68 (1): Run Time To Empty - Value Bytes [4-5]

<hr />

> *Index:* `2` | *Byte Length:* `48`

`<Buffer d0 00 85 00 01 00 00 00 44 00 85 00 00 00 00 00 45 00 85 00 00 00 00 00 46 00 85 00 01 00 00 00 43 00 85 00 00 00 00 00 42 00 85 00 00 00 00 00>`

- d0 (1): AC Present - Value Byte [4]
- 44 (2): Charging - Value Byte [12]
- 45 (3): Discharging - Value Byte [20]
- 46 (4): Fully Charged - Value Byte [28]
- 43 (5): ~~Remaining Time Limit Expired - Value Byte [36]~~ <mark>Ignore</mark>
- 42 (6): ~~Below Remaining Capacity Limit - Value Byte [44]~~ <mark>Ignore</mark>

<hr />

> *Index:* `3` | *Byte Length:* `16`

`<Buffer 30 00 84 00 76 00 00 00 30 00 84 00 76 00 00 00>`

- 30 (1): ~~Reserved - Value Byte [4]~~ <mark>Ignore</mark>
- 30 (2): ~~Reserved - Value Byte [12]~~ <mark>Ignore</mark>

<hr />

> *Index:* `4` | *Byte Length:* `8`

`<Buffer 35 00 84 00 0e 00 00 00>`

- 35 (1): ~~Reserved~~ <mark>Ignore</mark>

<hr />

> *Index:* `5` | *Byte Length:* `8`

`<Buffer 65 00 84 00 00 00 00 00>`

- 65 (1): ~~Absolute State Of Charge [4]~~ <mark>Ignore</mark>

<hr />

> *Index:* `6` | *Byte Length:* `8`

`<Buffer 9e 00 01 ff 00 00 00 00>`

- 9e (1): ~~Reserved~~ <mark>Ignore</mark>

<hr />

> *Index:* `7` | *Byte Length:* `8`

`<Buffer 5a 00 84 00 01 00 00 00>`

- 5a (1): ~~Reserved~~ <mark>Ignore</mark>

<hr />

> *Index:* `8` | *Byte Length:* `8`

`<Buffer 2a 00 85 00 2c 01 00 00>`

- 2a (1): ~~Remaining Time Limit - Value Byte [4-5]~~ <mark>Ignore</mark>

<hr />

> *Index:* `9` | *Byte Length:* `8`

`<Buffer 58 00 84 00 00 00 00 00>`

- 58 (1): ~~Reserved~~ <mark>Ignore</mark>

<hr />

> *Index:* `10` | *Byte Length:* `8`

`<Buffer 57 00 84 00 ff ff ff ff>`

- 57 (1): ~~Reserved~~ <mark>Ignore</mark>

<hr />

> *Index:* `11` | *Byte Length:* `8`

`<Buffer 56 00 84 00 ff ff ff ff>`

- 56 (1): ~~Reserved~~ <mark>Ignore</mark>

<hr />

> *Index:* `12` | *Byte Length:* `8`

`<Buffer 40 00 84 00 78 00 00 00>`

- 40 (1): Terminate Charge - Value Byte [4-5] <mark>Ignore</mark>

<hr />

### Descriptors `SL950U`

```yaml

TODO

```

## References

>
> - https://usb.org/sites/default/files/hut1_6.pdf
> - https://eleccelerator.com/usbdescreqparser/
> - https://docs.kernel.org/hid/hidintro.html
> - https://eleccelerator.com/tutorial-about-usb-hid-report-descriptors/
> - https://github.com/kastaniotis/Sups/wiki/5.-Supported-UPS-Devices-and-HID
> - https://learn.adafruit.com/custom-hid-devices-in-circuitpython/report-descriptors
>