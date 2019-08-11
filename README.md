# tron-transaction-downloader
Node.js script to download all transactions for an account using TronGrid and write them to a CSV file.

For a more complex script that extracts only the transfer transactions, looks up information for TRC10 tokens, corrects for number of decimal places and attempts to download information for TRC20 transfers please see [tron-transfers-downloader](https://github.com/ColonelJ/tron-transfers-downloader).

## Usage
```bash
yarn
yarn start <tron-address> <output-csv-file>
```
