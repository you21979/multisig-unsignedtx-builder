'use strict'
const coininfo = require('coininfo');

const coinparam = module.exports = (coinname, prefix) => {
    const coin = coininfo(coinname)
    if(!coin) throw new Error('unknown coin')
    const param = coin.toBitcoinJS()
    param.messagePrefix = (prefix || '') + param.name + " Signed Message:\n"
    return param
}

