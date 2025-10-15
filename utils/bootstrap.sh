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

# shellcheck disable=SC2250
inst_nodejs(){
  # @desc: Installs Node.js version 24.10.0 using nvm (Node Version Manager). It
  #        also includes package managers npm and npx.
  # @ref : https://nodejs.org/en/download
  local -r node_ver="24"; local -r nvm_ver="0.40.3";
  local -r uri="https://raw.githubusercontent.com/nvm-sh/nvm/v${nvm_ver}/install.sh";
  
  if command -v node >/dev/null 2>&1; then
    echo "Node.js is already installed. Skipping installation.";
    #node -v && npm -v && npx -v; return 0;
    echo "Checking Node.js version...";
    local curr_ver; curr_ver=$(node -v | grep -oE '^[0-9]+' | head -1);
    if [[ "${curr_ver}" == "${node_ver}" ]]; then
      echo "Node.js version ${node_ver} is already installed. Skipping installation.";
      return 0;
    else
      echo "Different Node.js version (${curr_ver}) detected. Proceeding with installation of version ${node_ver}.";
    fi
  fi
  echo "Installing NodeJS ver ${node_ver}, NVM ver ${nvm_ver}.";
  cd "$HOME" || exit 1;
  curl -o- "${uri}" | bash
  # shellcheck disable=SC1091
  \. "$HOME/.nvm/nvm.sh" # in lieu of restarting the shell
  nvm install "$node_ver"; # Download and install Node.js
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
};

inst_node_modules(){
  local ret;
  cd "${_wai}/../" || exit 1;
  #declare -a modarr=(
  #  "node-hid" "yoctocolors"
  #);
  #for m in ${!modarr[*]}; do
    #if ! npm list --depth=0 "${modarr[$m]}" >/dev/null 2>&1; then
    if ! npm list --depth=0 "node-hid" "yoctocolors" >/dev/null 2>&1; then
      #echo "installing npm module [${modarr[$m]}]";
      #npm install -g "${modarr[$m]}" >/dev/null; ret=$?;
      echo "installing npm modules from package.json";
      npm install >/dev/null; ret=$?;
      if [[ ${ret} -ne 0 ]]; then
        #echo "npm install for module [${modarr[$m]}] returned [${ret}]"; exit 1;
        echo "npm install for modules returned [${ret}]";
        exit 1;
      fi
    fi
  #done
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