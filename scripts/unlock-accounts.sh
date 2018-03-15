#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

: ${npm_config_web3_port:=8545}
: ${npm_config_web3_host:=0.0.0.0}

CMD=$(cat <<EOF
personal.unlockAccount(personal.listAccounts[0], "", 0);
personal.unlockAccount(personal.listAccounts[1], "decide-fifty-control-myself", 0);
miner.setEtherbase(personal.listAccounts[0]);
miner.start(1);
EOF
)

geth --exec "$CMD" attach http://$npm_config_web3_host:$npm_config_web3_port
