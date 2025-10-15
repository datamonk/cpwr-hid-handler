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