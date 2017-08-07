# multisig-unsignedtx-builder 

## 用途

utxoのリストからマルチシグの未署名トランザクションを作成する

## インストール

```
npm i 
```

## 設定

* config/xpub.json
* マルチシグの拡張公開鍵の設定
* redeem_scriptを作るために用意します

```
{
 "keys": [{
  "neededSignatures": 2,
  "masterPubkeys": [
   "xpub6...",
   "xpub6...",
   "xpub6..."
  ]
 }]
}
```

## 使い方

```
./bin/rawtx_builder.js -f ./utxos.json -a bitcoin_address
```

## utxo フォーマット

* オブジェクトの配列
* tx_id
* tx_vout
* amount (satoshi単位)
* hdpath (xprvからスプリット後のパス)

```
[
 {
  "tx_id":"",
  "tx_vout":0,
  "amount":0,
  "hdpath":"0/0/0/0"
 }
]
```

## オプション

```
./bin/rawtx_builder.js -h

  Usage: rawtx_builder [options]


  Options:

    -V, --version      output the version number
    -f, --file <n>     utxo json file
    -a, --address <n>  spent address
    -s, --spb <n>      transaction fees. satoshi per byte
    -d, --divide <n>   transaction divide unit
    -h, --help         output usage information
```


