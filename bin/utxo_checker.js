#!/usr/bin/env node
const fs = require("fs")
const program = require('commander')
const rp = require('request-promise')
const task = require('promise-util-task')

program
  .version('0.0.1')
  .option('-f, --file <n>', 'utxo json file')
  .parse(process.argv);

const main = (opt) => {
    return task.seq(opt.inputs.map(input => console.log(input)))
}

const getopt = (program) => {
    if(program.file === void 0) throw new Error("please input file")
    const inputs = JSON.parse(fs.readFileSync(program.file, "utf8"))
    return {
        inputs : inputs,
    }
}

main(getopt(program))
