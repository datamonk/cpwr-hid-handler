#!/usr/bin/env bash

set -o pipefail; ##
# @file: bootstrap.sh
# @tldr: Environment bootstrap script for setting local dependencies.
##

_wai(){ printf "$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"; }; _wai="$(_wai)"; _pn="${0##*/}";
_fl(){ grep -E "^[a-z].*\(\)\{" "$0" | cut -d'(' -f1 | grep -v "${FUNCNAME[0]}"; };

# Prefixing with '_' to avoid auto-exec by the script.
_inst_pkgs(){
  local ret;
  declare -a pkgarr=(
    "curl" "git" "vim" "usbutils"
  );
  sudo apt -qq update >/dev/null;
  for p in ${!pkgarr[*]}; do
    if [[ $(dpkg-query -W -f='${Status}' ${pkgarr[$p]} 2>/dev/null | grep -c "ok installed") -eq 0 ]]; then
    echo "installing pkg dependency [${pkgarr[$p]}]";
      sudo DEBIAN_FRONTEND=noninteractive apt-get -y -qq install "${pkgarr[$p]}" >/dev/null; ret=$?;
      if [[ ${ret} -ne 0 ]]; then
        echo "apt install for pkg [${pkgarr[$p]}] returned [${ret}]"; exit 1;
      fi
    fi
  done
  return 0;
};

chk_glibc_ver() {
  local ret glibc_info ver_str;
  glibc_info=$(ldd --version 2>&1); ret=$?;
  # @output:
  #   ldd (GNU libc) 2.26
  #   Copyright (C) 2017 Free Software Foundation, Inc.
  #   This is free software; see the source for copying conditions.  There is NO
  #   warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  #   Written by Roland McGrath and Ulrich Drepper.
  if [[ ${ret} -eq 0 ]]; then
    echo -e "GLIBC Version Information:\n  ${glibc_info}";
    # Extract the version number (ie, 2.26)
    ver_str=$(echo "${glibc_info}" | head -n 1 | grep -oP 'GLIBC \K[0-9.]+');
    if [[ -n "${ver_str}" ]]; then
      #echo "Extracted GLIBC version: ${ver_str}";
      echo "${ver_str}";
      return 0;
    fi
  else
    echo "Error: Could not retrieve GLIBC version. 'ldd --version' failed.";
    echo "Output from ldd: ${glibc_info}";
    return 1;
  fi
};

get_target_node_ver() {
  local target_node_ver;
  local -r glibc_ver="$1";

  #if ! command -v nvm &> /dev/null; then
  #  echo "Error: nvm is not installed. Please install nvm first."
  #  return 1;
  #fi

  # Get glibc version
  #glibc_ver=$(ldd --version 2>&1 | head -n 1 | awk '{print $NF}')
  #echo "Detected glibc version: $glibc_ver"

  # Determine recommended Node.js version based on glibc
  #target_node_ver=""
  #if [[ "$glibc_ver" < "2.27" ]]; then
  if [[ $(echo "${glibc_ver} < 2.27" | bc) == 1 ]]; then
    #target_node_ver="16.15.1";
    target_node_ver="17.9.1";
    echo "${target_node_ver}";
    return 0;
    #echo "glibc older then 2.27 detected. Recommending Node.js v${target_node_ver}."
  elif [[ "${glibc_ver}" =~ ^2.2(7|8)$ ]]; then
    target_node_ver="--lts"
    echo "${target_node_ver}";
    return 0;
    #echo "glibc version ${glibc_ver} detected. Recommending Node.js v${target_node_ver}."
  else
    #echo "glibc version ${glibc_ver} is recent enough for newer Node.js versions. No specific older version recommended based on glibc."
    echo "not sure how to handle ${glibc_ver}. no recommendations.."
    return 1;
  fi
};

# shellcheck disable=SC2250
inst_nodejs(){
  # @desc: Installs Node.js version 24.10.0 using nvm (Node Version Manager). It
  #        also includes package managers npm and npx.
  # @ref : https://nodejs.org/en/download
  #local -r node_ver="24"; # newer baseline supporting GLIBC_2.27+
  #local -r node_ver="17"; # supports legacy GLIBC_2.17 for older kernels
  local -r nvm_ver="0.40.3";
  local -r uri="https://raw.githubusercontent.com/nvm-sh/nvm/v${nvm_ver}/install.sh";

  local glibc_ver node_ver;
  glibc_ver=$(chk_glibc_ver);
  node_ver=$(get_target_node_ver "${glibc_ver}");
  
  if command -v node >/dev/null 2>&1; then
    echo "Node.js is already installed. Skipping installation.";
    echo "Checking Node.js version...";
    local curr_ver; curr_ver=$(node -v | grep -oE '^[0-9]+' | head -1);
    if [[ "${curr_ver}" == "${node_ver}" ]]; then
      echo "Node.js version ${node_ver} is already installed. Skipping installation.";
      nvm use "${node_ver}";
      return 0;
    else
      echo "Different Node.js version (${curr_ver}) detected. Proceeding with installation of version ${node_ver}.";
      nvm uninstall "${curr_ver}";
    fi
  fi

  if ! command -v nvm &> /dev/null; then
  #  echo "Error: nvm is not installed. Please install nvm first."
  #  return 1;
  #fi
  echo "Installing NodeJS ver ${node_ver}, NVM ver ${nvm_ver}.";
  cd "$HOME" || exit 1;
  curl -o- "${uri}" | bash
  # shellcheck disable=SC1091
  \. "$HOME/.nvm/nvm.sh" # in lieu of restarting the shell
  nvm install "$node_ver"; # --lts | Download and install Node.js
  nvm use "$node_ver";
  node -v \
    && nvm current \
    && npm -v \
    && npx -v \
    && nvm --version;
  if [[ $? -ne 0 ]]; then
    echo "Error installing Node.js version ${node_ver}."; exit 1;
  fi
  source "$HOME/.bashrc"; # re-source env with new export includes
  return 0;
  fi;
};

inst_node_modules(){
  local ret;
  cd "${_wai}/../" || exit 1;
    if ! npm list --depth=0 "node-hid" "yoctocolors" >/dev/null 2>&1; then
      echo "installing npm modules from package.json";
      #npm install >/dev/null; ret=$?; # all deps
      #npm install --production >/dev/null; ret=$?; # non-dev deps by default
      npm install --omit=dev >/dev/null; ret=$?; # non-dev deps by default
      if [[ ${ret} -ne 0 ]]; then
        echo "npm install for modules returned [${ret}]";
        exit 1;
      fi
    fi
  return 0;
};

mapfile -t farr < <(_fl);
for f in "${farr[@]}"; do
  # shellcheck disable=SC2076
  if [[ "${f}" =~ ^"_"[a-z]* ]] || [[ "${f}" =~ ^"log" ]]; then
    continue; # skip helpers with '_|log' prefix(es)
  fi
  echo "Starting eval for [${f}]";
  eval "${f}";
done

echo "Bootstrap script [${_pn}] completed successfully.";