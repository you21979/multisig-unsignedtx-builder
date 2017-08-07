#!/usr/bin/env node
const fs = require("fs")
const program = require('commander')
const rp = require('request-promise')
const task = require('promise-util-task')
const sleep = require('@you21979/promise-sleep')

program
  .version('0.0.1')
  .option('-f, --file <n>', 'utxo json file')
  .parse(process.argv);

const req = (tx, vout, wait) => {
    return rp("https://insight.bitpay.com/api/tx/"+tx).then(JSON.parse).then(res => {
        if(res.vout[vout].spentTxId !== null){
            console.log("check tx SPENT " + [tx, vout].join(":"))
        }
        return sleep(wait, [tx, vout, res.vout[vout].spentTxId === null])
    })
}

const main = (opt) => {
    return task.seq(opt.inputs.map(input => () => req(input.tx_id, input.tx_vout, 1000))).filter(v => v[2] === false)
}

const getopt = (program) => {
    if(program.file === void 0) throw new Error("please input file")
    const inputs = JSON.parse(fs.readFileSync(program.file, "utf8"))
    return {
        inputs : inputs,
    }
}

main(getopt(program)).then(console.log)
