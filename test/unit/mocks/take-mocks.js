/*
  Mock data for unit tests of the take.js library
*/

const offerData01 = {
  messageType: 1,
  messageClass: 1,
  tokenId: 'a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2',
  buyOrSell: 'sell',
  rateInBaseUnit: 8478,
  minUnitsToExchange: 8478,
  numTokens: 1,
  makerAddr: 'bitcoincash:qq04t0jhllzztrh2ypxy88ujff5wqv0kpgra2gt40d',
  ticker: 'TROUT',
  utxoTxid: '5dfd91589f1c0813154da4c2804fa38886cc2e47fa1d73cb8285df786a25c2cc',
  utxoVout: 1,
  tokenType: 1,
  dataType: 'offer'
}

// const offerData02 = {
//   appId: 'bch-dex-001',
//   data: {
//     messageType: 1,
//     messageClass: 1,
//     tokenId: '95ad948d454404fd7efe26789738da6d598f2718e141563c3ae17e84100e4417',
//     buyOrSell: 'sell',
//     rateInBaseUnit: 8599,
//     minUnitsToExchange: 8599,
//     numTokens: 1,
//     makerAddr: 'bitcoincash:qrqlz63cwmu0hcmsrfnd8jemn3atkpaqds6tf4ksrr',
//     ticker: 'XPHX',
//     utxoTxid: '87b55ec6ba6f1ee4ac48ccb59b0cbe4b22aadeb607e8077c87d81e2c13b6e48b',
//     utxoVout: 1,
//     tokenType: 1,
//     dataType: 'offer'
//   },
//   timestamp: '2022-08-28T23:35:39.888Z',
//   localTimeStamp: '8/28/2022, 11:35:39 PM'
// }
const offerData02 = {
  messageType: 1,
  messageClass: 1,
  tokenId: '95ad948d454404fd7efe26789738da6d598f2718e141563c3ae17e84100e4417',
  buyOrSell: 'sell',
  rateInBaseUnit: 8599,
  minUnitsToExchange: 8599,
  numTokens: 1,
  makerAddr: 'bitcoincash:qrqlz63cwmu0hcmsrfnd8jemn3atkpaqds6tf4ksrr',
  ticker: 'XPHX',
  utxoTxid: '87b55ec6ba6f1ee4ac48ccb59b0cbe4b22aadeb607e8077c87d81e2c13b6e48b',
  utxoVout: 1,
  tokenType: 1,
  dataType: 'offer',
  operatorAddress: 'bitcoincash:qzl0d3gcqeypv4cy7gh8rgdszxa9vvm2acv7fqtd00',
  operatorPercentage: 2
}

const counterOfferUtxo01 = {
  txid: 'c97af37d84438ddc6fd9acce86a5217a4dd6c8ace6c2310e068087926ff8b92d',
  vout: 0,
  hdIndex: 1,
  wif: 'L2maHmC39fFfjT8yFYjzagQJqNeQKFeRZaUgFRtR1QCgwUjcdAWB',
  sats: 9599
}

const txData01 = [
  {
    txid: '87b55ec6ba6f1ee4ac48ccb59b0cbe4b22aadeb607e8077c87d81e2c13b6e48b',
    hash: '87b55ec6ba6f1ee4ac48ccb59b0cbe4b22aadeb607e8077c87d81e2c13b6e48b',
    version: 2,
    size: 663,
    locktime: 0,
    vin: [
      {
        txid: 'e7a9e879df728d64fb70402e0704fa697dfce57b40fe328b402a25880fefe5d8',
        vout: 2,
        scriptSig: {
          asm: '3045022100812f57fb3b4a48ba811982b1aa0fbd3042b8d7d0208e7ebd0d8ac4bd4500a4460220095db3ef9284a051f388a6f35fc82287f8484691540c278844b8899bb339e3f1[ALL|FORKID] 025ebe8f67be233499a2ca53b28c01585fa12d6de71512431b9eaf2fc7b9589420',
          hex: '483045022100812f57fb3b4a48ba811982b1aa0fbd3042b8d7d0208e7ebd0d8ac4bd4500a4460220095db3ef9284a051f388a6f35fc82287f8484691540c278844b8899bb339e3f14121025ebe8f67be233499a2ca53b28c01585fa12d6de71512431b9eaf2fc7b9589420'
        },
        sequence: 4294967295,
        address: 'bitcoincash:qrqlz63cwmu0hcmsrfnd8jemn3atkpaqds6tf4ksrr',
        value: 0.00000546,
        tokenQtyStr: '4',
        tokenQty: 4,
        tokenId: '95ad948d454404fd7efe26789738da6d598f2718e141563c3ae17e84100e4417'
      },
      {
        txid: '8e696d7740e66c95a1e1e8193858b70e3d76edb11703fa36b43e6a248281ab0f',
        vout: 1,
        scriptSig: {
          asm: '3045022100eac9a0b6ed627bba7e4249efea350c51fc374beefb0339066df70934f9163144022040e2c45a0f3adcaa1981ff9b19dc6e86ba8e3469cadf638087d1517e829bc374[ALL|FORKID] 025ebe8f67be233499a2ca53b28c01585fa12d6de71512431b9eaf2fc7b9589420',
          hex: '483045022100eac9a0b6ed627bba7e4249efea350c51fc374beefb0339066df70934f9163144022040e2c45a0f3adcaa1981ff9b19dc6e86ba8e3469cadf638087d1517e829bc3744121025ebe8f67be233499a2ca53b28c01585fa12d6de71512431b9eaf2fc7b9589420'
        },
        sequence: 4294967295,
        address: 'bitcoincash:qrqlz63cwmu0hcmsrfnd8jemn3atkpaqds6tf4ksrr',
        value: 0.00000546,
        tokenQtyStr: '1',
        tokenQty: 1,
        tokenId: '95ad948d454404fd7efe26789738da6d598f2718e141563c3ae17e84100e4417'
      },
      {
        txid: 'bcb5c818e8d2f56956887ba84fe6eac6716163f2dcb9bf4c5015294bbee59670',
        vout: 3,
        scriptSig: {
          asm: '3045022100b7cce2cfebead841c1de18c07893b2090532613a497170c1d44e4b72dd039805022046c322e487fce60e842d240e1a3150c019a6cc09b512385c2395c7200876f929[ALL|FORKID] 025ebe8f67be233499a2ca53b28c01585fa12d6de71512431b9eaf2fc7b9589420',
          hex: '483045022100b7cce2cfebead841c1de18c07893b2090532613a497170c1d44e4b72dd039805022046c322e487fce60e842d240e1a3150c019a6cc09b512385c2395c7200876f9294121025ebe8f67be233499a2ca53b28c01585fa12d6de71512431b9eaf2fc7b9589420'
        },
        sequence: 4294967295,
        address: 'bitcoincash:qrqlz63cwmu0hcmsrfnd8jemn3atkpaqds6tf4ksrr',
        value: 0.00005157,
        tokenQty: 0,
        tokenQtyStr: '0',
        tokenId: null
      }
    ],
    vout: [
      {
        value: 0,
        n: 0,
        scriptPubKey: {
          asm: 'OP_RETURN 5262419 1 1145980243 95ad948d454404fd7efe26789738da6d598f2718e141563c3ae17e84100e4417 00000000000f4240 00000000003d0900',
          hex: '6a04534c500001010453454e442095ad948d454404fd7efe26789738da6d598f2718e141563c3ae17e84100e44170800000000000f42400800000000003d0900',
          type: 'nulldata'
        },
        tokenQty: null,
        tokenQtyStr: null
      },
      {
        value: 0.00000546,
        n: 1,
        scriptPubKey: {
          asm: 'OP_DUP OP_HASH160 272881470cbe73174b9fbbe6c1e25d302c9d6715 OP_EQUALVERIFY OP_CHECKSIG',
          hex: '76a914272881470cbe73174b9fbbe6c1e25d302c9d671588ac',
          reqSigs: 1,
          type: 'pubkeyhash',
          addresses: [
            'bitcoincash:qqnj3q28pjl8x96tn7a7ds0zt5cze8t8z528fgq09n'
          ]
        },
        tokenQtyStr: '1',
        tokenQty: 1
      },
      {
        value: 0.00000546,
        n: 2,
        scriptPubKey: {
          asm: 'OP_DUP OP_HASH160 c1f16a3876f8fbe3701a66d3cb3b9c7abb07a06c OP_EQUALVERIFY OP_CHECKSIG',
          hex: '76a914c1f16a3876f8fbe3701a66d3cb3b9c7abb07a06c88ac',
          reqSigs: 1,
          type: 'pubkeyhash',
          addresses: [
            'bitcoincash:qrqlz63cwmu0hcmsrfnd8jemn3atkpaqds6tf4ksrr'
          ]
        },
        tokenQtyStr: '4',
        tokenQty: 4
      },
      {
        value: 0.00002,
        n: 3,
        scriptPubKey: {
          asm: 'OP_DUP OP_HASH160 203b64bfbaa9e58333295b621159ddebc591ecb1 OP_EQUALVERIFY OP_CHECKSIG',
          hex: '76a914203b64bfbaa9e58333295b621159ddebc591ecb188ac',
          reqSigs: 1,
          type: 'pubkeyhash',
          addresses: [
            'bitcoincash:qqsrke9lh257tqen99dkyy2emh4uty0vky9y0z0lsr'
          ]
        },
        tokenQty: null,
        tokenQtyStr: null
      },
      {
        value: 0.00002023,
        n: 4,
        scriptPubKey: {
          asm: 'OP_DUP OP_HASH160 c1f16a3876f8fbe3701a66d3cb3b9c7abb07a06c OP_EQUALVERIFY OP_CHECKSIG',
          hex: '76a914c1f16a3876f8fbe3701a66d3cb3b9c7abb07a06c88ac',
          reqSigs: 1,
          type: 'pubkeyhash',
          addresses: [
            'bitcoincash:qrqlz63cwmu0hcmsrfnd8jemn3atkpaqds6tf4ksrr'
          ]
        },
        tokenQty: null,
        tokenQtyStr: null
      }
    ],
    hex: '0200000003d8e5ef0f88252a408b32fe407be5fc7d69fa04072e4070fb648d72df79e8a9e7020000006b483045022100812f57fb3b4a48ba811982b1aa0fbd3042b8d7d0208e7ebd0d8ac4bd4500a4460220095db3ef9284a051f388a6f35fc82287f8484691540c278844b8899bb339e3f14121025ebe8f67be233499a2ca53b28c01585fa12d6de71512431b9eaf2fc7b9589420ffffffff0fab8182246a3eb436fa0317b1ed763d0eb7583819e8e1a1956ce640776d698e010000006b483045022100eac9a0b6ed627bba7e4249efea350c51fc374beefb0339066df70934f9163144022040e2c45a0f3adcaa1981ff9b19dc6e86ba8e3469cadf638087d1517e829bc3744121025ebe8f67be233499a2ca53b28c01585fa12d6de71512431b9eaf2fc7b9589420ffffffff7096e5be4b2915504cbfb9dcf2636171c6eae64fa87b885669f5d2e818c8b5bc030000006b483045022100b7cce2cfebead841c1de18c07893b2090532613a497170c1d44e4b72dd039805022046c322e487fce60e842d240e1a3150c019a6cc09b512385c2395c7200876f9294121025ebe8f67be233499a2ca53b28c01585fa12d6de71512431b9eaf2fc7b9589420ffffffff050000000000000000406a04534c500001010453454e442095ad948d454404fd7efe26789738da6d598f2718e141563c3ae17e84100e44170800000000000f42400800000000003d090022020000000000001976a914272881470cbe73174b9fbbe6c1e25d302c9d671588ac22020000000000001976a914c1f16a3876f8fbe3701a66d3cb3b9c7abb07a06c88acd0070000000000001976a914203b64bfbaa9e58333295b621159ddebc591ecb188ace7070000000000001976a914c1f16a3876f8fbe3701a66d3cb3b9c7abb07a06c88ac00000000',
    blockheight: 755316,
    isSlpTx: true,
    tokenTxType: 'SEND',
    tokenId: '95ad948d454404fd7efe26789738da6d598f2718e141563c3ae17e84100e4417',
    tokenType: 1,
    tokenTicker: 'XPHX',
    tokenName: 'PhoenixCo Token',
    tokenDecimals: 6,
    tokenUri: 't.me/tsoph',
    tokenDocHash: '',
    isValidSlp: true
  }
]

export default {
  offerData01,
  offerData02,
  counterOfferUtxo01,
  txData01
}
