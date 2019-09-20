const fsPromises = require('fs').promises;
const TronWeb = require('tronweb');
const TronGrid = require('trongrid');

if (process.argv.length < 3) {
    console.error('Usage: node index.js TRON-ADDRESS [output.csv]');
    return;
}
address = process.argv[2];
outputFile = 'output.csv';
if (process.argv.length >= 4) {
    outputFile = process.argv[3];
}
console.log('Writing to file ' + outputFile + '...');
let csvFile;

const tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io'
});
const tronGrid = new TronGrid(tronWeb);

async function processTransaction(tx) {
    await csvFile.write((tx.txID || '') + ',' + ((tx.ret.length > 0 ? tx.ret[0].code : '') || '') + ',' + (tx.raw_data.timestamp || '') + ',' + (tx.raw_data.contract[0].type || '') + ',' + (tronWeb.address.fromHex(tx.raw_data.contract[0].parameter.value.owner_address) || '') + ',' + (tronWeb.address.fromHex(tx.raw_data.contract[0].parameter.value.to_address) || '') + ',' + (tx.raw_data.contract[0].parameter.value.amount || '') + ',' + (tx.raw_data.contract[0].parameter.value.asset_name || '') + '\n');
}

async function main() {
    try {
        csvFile = await fsPromises.open(outputFile, 'w');
        options = {limit: 200};
        reply = await tronGrid.account.getTransactions(address, options);
        while (true) {
            if (reply.success) {
                for (let i = 0; i < reply.data.length; ++i) {
                    await processTransaction(reply.data[i]);
                }
                if (reply.meta.fingerprint) {
                    options.fingerprint = reply.meta.fingerprint;
                    reply = await tronGrid.account.getTransactions(address, options);
                } else {
                    break;
                }
            } else {
                console.error('Received unsuccessful response from TronGrid API');
                return;
            }
        }
    } catch (err) {
        console.error(err);
        return;
    } finally {
        if (csvFile !== undefined) {
            await csvFile.close();
        }
    }
}

main().catch(function (err) {
    console.error(err);
    process.exit(1);
});
