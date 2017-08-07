'use strict'
const bitcoin = require('bitcoinjs-lib');
const util = require('bitcoin-util-fee');

var TxBuilder = module.exports = function(m, n, feesize, network){
    this.network = network;
    this.total_input_value = 0;
    this.total_output_value = 0;
    this.feesize = feesize;
    this.inputs = [];
    this.outputs = [];
    this.spec = {
        m : m,
        n : n,
    };
}

TxBuilder.prototype.addInput = function(txid, vout_n, satoshi, redeem_script, hdpath){
    this.total_input_value += satoshi;
    this.inputs.push({
        txid : txid,
        vout : vout_n,
        redeem_script : redeem_script,
        hdpath : hdpath,
        satoshi : satoshi,
    })
}

TxBuilder.prototype.addSpent = function(address, satoshi){
    this.total_output_value += satoshi;
    this.outputs.push({
        address : address,
        satoshi : satoshi
    })
}

TxBuilder.prototype.calcByte = function(){
    var len = 1;
    return util.tx_calc_byte(util.p2sh_calc_input_byte(this.spec.m, this.spec.n), this.inputs.length, len)
}


TxBuilder.prototype.calcFees = function(){
    return util.tx_calc_fee(this.calcByte(), this.feesize);
}

TxBuilder.prototype.unsignedBuild = function(){
    var network = this.network;
    var fees = this.calcFees();
    if(this.total_input_value - fees <= 0){
        throw new Error('insufficient balance');
    }
    var change_value = this.total_input_value - this.total_output_value - fees;
    if(change_value < 0){
        throw new Error('insufficient balance');
    }
    var input_details = [];

    var txb = new bitcoin.TransactionBuilder(network);
    this.inputs.forEach(function(input){
        input_details.push({
            redeem_script : input.redeem_script,
            hdpath : input.hdpath,
            satoshi : input.satoshi,
        })
        txb.addInput(input.txid, input.vout);
    })
    this.outputs.forEach(function(output){
        var address = bitcoin.address.toOutputScript(output.address, network)
        txb.addOutput(address, output.satoshi);
    })

    var rawtx = txb.buildIncomplete().toHex();
    return {
        result : {
            rawtx : rawtx,
            inputs : input_details,
            iscomplete : false,
        },
        debug : {
            input : this.total_input_value,
            output : this.total_output_value,
            miner : fees,
            spb : this.feesize,
        }
    }
}

