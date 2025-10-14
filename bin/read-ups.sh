#!/usr/bin/env bash

set -o pipefail; ##
# @file: read-ups.sh
# @tldr: Wrapper bash script to exec nodejs file [read-ups.js]
#        and acting as the primary module binary.
##

## @globals
_wai(){ printf "$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"; }; _wai="$(_wai)"; 
# Strip the extension from this procname and use it for the js exec
_pn="${0##*/}"; _scr="$(basename "${_pn}.js")";
##

main(){
  if [[ ! -f "${_scr}" ]]; then
    echo "Error: JavaScript file '${_scr}' not found.";
    return 1;
  fi
  $(type -p node) "${_wai}/../${_scr}" "$@";
  return $?;
};
# @usage: ./bin/read-ups --mode once --verbose
# @output:
#   ----- Running [read-ups.js] at Mon 13 Oct 2025 11:28:36 AM EDT -----
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

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  echo -e "----- Running [${_scr}] at $(date) -----\n";
  main "$@";
  # shellcheck disable=SC2181
  if [[ $? -ne 0 ]]; then
    echo "Error processing arguments."; exit 1;
  fi
fi