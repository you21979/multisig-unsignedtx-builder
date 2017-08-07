'use strict'
const fs = require("fs")
const multisig = require("multisig-wallet")
const TxBuilder = require('./txbuilder')
const coinparam = require('./coinparam')

const maketx = (txs, coin, hdw, pubs, spentaddress, spb) => {
    const txb = new TxBuilder(pubs.masterPubkeys.length, pubs.neededSignatures, spb, coin)
    txs.forEach(input => {
        const w = hdw.makeWallet(input.hdpath, coinparam(coin))
        txb.addInput(input.tx_id, input.tx_vout, input.amount, w.createRedeemScript(), input.hdpath)
    })
    const fee = txb.calcFees()
    txb.addSpent(spentaddress, txb.total_input_value - fee)
    return txb.unsignedBuild()
}

const main = module.exports = (opt) => {
    const coin = opt.coin
    const pubs = opt.pubs
    const inputs = opt.inputs
    const spb = opt.spb
    const divide_unit = opt.divide_unit
    const hdw = new multisig.HDWallet(pubs.masterPubkeys, pubs.neededSignatures)
    const spentaddress = opt.spentaddress

    console.log("coin type: " + coin)
    console.log("utxo count: " + inputs.length)
    console.log("divide_unit : " + divide_unit)
    console.log("satoshi/bytes : " + spb)
    console.log("spent address : " + spentaddress)

    console.log("build unsigned transaction")
    const res = []
    for(let i = 0; i<inputs.length; i = i + divide_unit){
        console.log("process :" + i)
        let r = maketx(inputs.slice(i, i + divide_unit), coin, hdw, pubs, spentaddress, spb)
        r.debug.input = (r.debug.input * 1e-8).toFixed(8)
        r.debug.output = (r.debug.output * 1e-8).toFixed(8)
        r.debug.miner = (r.debug.miner * 1e-8).toFixed(8)
        console.log(r.debug)
        res.push(r.result)
    }
    console.log("output file")
    res.map(r => JSON.stringify(r, null, 2)).forEach((r, idx) => {
        fs.writeFileSync(["./", "unsigned_tx_", idx, ".json"].join(""), r, "utf8")
    })
}

