'use strict';

const fs = require('fs');
const atob = require('atob');
const args = process.argv.slice(2);

let rawdata = fs.readFileSync(args[0]);
const txsRes = JSON.parse(rawdata);

const { transactions } = txsRes;

const cAddresses = transactions
  .filter(
    (tx, index, arr) =>
      tx.memo &&
      arr.findIndex(_tx => _tx.memo === tx.memo) === index
  )
  .map(
    ({
      id,
      memo,
    }) => ({
      id,
      memo: atob(memo),
    })
  )

fs.writeFileSync(args[1], JSON.stringify(cAddresses), null, 2)
