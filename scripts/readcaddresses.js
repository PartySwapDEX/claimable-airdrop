'use strict';

const fs = require('fs');

let rawdata = fs.readFileSync('VIPGOLD2.json');
const txsRes = JSON.parse(rawdata);

const { transactions } = txsRes;

fs.writeFileSync('VIPGOLD-C-ADDRESSES.json', JSON.stringify(transactions.map(
  ({
    id,
    memo,
  }) => ({
    id,
    memo
  })
), null, 2))