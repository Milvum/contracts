#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

# Get the directory of the script, so that it is not dependant on the dir it is run from
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

SOLCJS="$DIR/node_modules/solc/solcjs"

# Compile contracts
"$SOLCJS" $DIR/contracts/* --bin --abi -o "$DIR/compiled-contracts"

# Rename
for old in $DIR/compiled-contracts/*; do
    new=$(echo $old | sed -e 's/\/[^\/]*sol_/\//')
    mv -v "$old" "$new"
done

# @TODO automatically include the compiled-contracts folder to the stemapp project
