#!/usr/bin/env node
const fs = require("fs")
const program = require('commander')
const main = require('../lib/main')
const constant = require('../lib/constant')

program
  .version('0.0.1')
  .option('-f, --file <n>', 'utxo json file')
  .option('-a, --address <n>', 'spent address')
  .option('-s, --spb <n>', 'transaction fees. satoshi per byte', (v) => parseInt(v), constant.SPB)
  .option('-d, --divide <n>', 'transaction divide unit', (v) => parseInt(v), constant.DIVIDE_UNIT)
  .option('-n, --network <n>', 'coin network[BTC,LTC,MONA]', (v) => (v), constant.COIN)
  .parse(process.argv);

const getopt = (program) => {
    if(program.file === void 0) throw new Error("please input file")
    if(program.address === void 0) throw new Error("please input address")
    const config = JSON.parse(fs.readFileSync("./config/xpub.json", "utf8"))
    const inputs = JSON.parse(fs.readFileSync(program.file, "utf8"))
    const pubs = config.keys[0]
    return {
        pubs : pubs,
        inputs : inputs,
        spentaddress : program.address,
        spb : program.spb,
        divide_unit : program.divide,
        coin : program.network,
    }
}

main(getopt(program))
