#!/usr/bin/env bash

set -o pipefail; ##
# @file: find-hid-ids.sh
# @tldr: Helper functions to identify product/vendor ids and udev rule modifications
#        for a filtered USB-HID device.
##

## @globals
_wai(){ printf "$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"; };
_wai="$(_wai)"; _pn="${0##*/}";
##

get_usb_hid_ids(){
  # @usage: get_usb_hid_ids "Cyber Power"
  local vid pid dev_str; dev_str="$1";
  if [[ -z "${dev_str}" ]]; then
    echo "@usage: get_usb_hid_ids \"<device_name_substring>\"";
    echo "@examp: get_usb_hid_ids \"Cyber Power\"";
    return 1;
  fi
  # Extract the device id values from lsusb filtered substring
  # output (ie, "0764:0501") and split.
  lsusb | grep -i "${dev_str}" | awk '{print $6}' | while IFS=":" read -r vid pid; do
    if [[ -n "${vid}" ]] && [[ -n "${pid}" ]]; then
      echo "${vid} ${pid}";
      return 0;
    fi
  done
};

gen_udev_rules(){
  local vid pid grp; vid="$1"; pid="$2"; grp="$3";
  if [[ -z "${vid}" ]] || [[ -z "${pid}" ]] || [[ -z "${grp}" ]]; then
    echo "@usage: gen_udev_rules <vendor_id> <product_id> <group>";
    echo "@examp: gen_udev_rules 0764 0501 plugdev";
    return 1;
  fi
  # @todo: Add option to automate the below changes if udev rules
  #        are not in place on the local system instead of manual
  #        instructions.
  echo -e "\nWrite the below rules output to a new udev rules file\n  $ sudo vim /etc/udev/rules.d/99-ups-hid.rules \n";
  cat <<EOF
# udev rules for cyberpower ups usb-hid device read/write access.
SUBSYSTEM=="input", GROUP="input", MODE="0666"
SUBSYSTEM=="usb", ATTR{idVendor}=="${vid}", ATTR{idProduct}=="${pid}", MODE="0666", GROUP="${grp}"
KERNEL=="hiddev*", ATTRS{idVendor}=="${vid}", ATTRS{idProduct}=="${pid}", MODE="0666", GROUP="${grp}"
KERNEL=="hidraw*", ATTRS{idVendor}=="${vid}", ATTRS{idProduct}=="${pid}", MODE="0666", GROUP="${grp}"
EOF
  echo -e "\nPropagate changes with:\n  $ sudo udevadm control --reload-rules && sudo udevadm trigger\n";
  echo -e "Confirm perm and group changes:\n  $ find /dev -regex '.*hid.*' -type c -group plugdev -exec ls -la {} +\n"
  echo -e "  crw-rw-rw- 1 root plugdev 239, 1 Oct 10 12:57 /dev/hidraw1 \n  crw-rw-rw- 1 root plugdev 180, 0 Oct 10 12:57 /dev/usb/hiddev0 \n"
};

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  # @todo: Stop being lazy and handle output parsing once within
  #        the function. 
  ids=$(get_usb_hid_ids "$@");
  gen_udev_rules "$(echo "${ids}" \
    | cut -d' ' -f1)" "$(echo "${ids}" \
    | cut -d' ' -f2)" "plugdev";
fi