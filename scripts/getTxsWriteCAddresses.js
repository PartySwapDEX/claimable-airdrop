'use strict';

const fs = require('fs');
const axios = require('axios');
const atob = require('atob');

const main = async () => {
  let txs = [];

  const fetchAppendTxs = async (params) => {
    const { data: { transactions, next } } = await axios.default.get(`https://explorerapi.avax.network/v2/transactions?${params || 'assetID=2UBD6evUf2qo1JxjnadAtcrGj4Eo1Kbeu4YCTB7JefnR8krtMP&chainID=11111111111111111111111111111111LpoYY&chainID=2q9e4r6Mu3U68nU1fYjgbR6JvwrRx36CohpAX5UQxse55x1Q5&chainID=2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM&limit=500'}`);
    txs = [...txs, ...transactions];
    if (next) {
      await fetchAppendTxs(next)
    }
  }

  try {
    await fetchAppendTxs();

    const cAddresses = txs
      .filter(
        (tx) =>
          tx.memo
      )
      .map(
        ({
          memo,
        }) => ({
          addr: atob(memo),
          amount: 46.39
        })
      )

    const createCsvWriter = require('csv-writer').createObjectCsvWriter;
    const csvWriter = createCsvWriter({
      path: 'c-addresses-silver.csv',
      header: [
        { id: 'addr' },
        { id: 'amount' }
      ]
    });

    await csvWriter.writeRecords(cAddresses);

  } catch (error) {
    console.log(error);
  }

}

main().then((res) => console.log('done'))