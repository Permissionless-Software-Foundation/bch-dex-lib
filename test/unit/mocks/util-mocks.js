/*
  A mocking library for bch-dex-util.js unit tests.
  A mocking library contains data to use in place of the data that would come
  from an external dependency.
*/

const mockP2wdbRead = {
  isValid: true,
  appId: 'bch-dex-001',
  createdAt: 1661781276525,
  _id: '630cc51c63d3530013d22114',
  hash: 'zdpuAv1tCSRBrWcG9oisXTMD5mKCUHqivu1StSu18Dexcw87B',
  key: '1a50e23400e42aafacb688c4424807928ac00ec930a681bc4985f24501d7ae49',
  value: {
    message: '2022-08-29T13:54:13.701Z',
    signature: 'H4OBtO8SxF6gNDN2lFZj79JlbDpd+Hn1xEXJwLZ0m3DPX/O5EJpT6TQHY0AIZmHQRQG73tt1GEiDEGkubcb/HVw=',
    data: '{"appId":"bch-dex-001","data":{"messageType":1,"messageClass":1,"tokenId":"a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2","buyOrSell":"sell","rateInBaseUnit":8478,"minUnitsToExchange":8478,"numTokens":1,"makerAddr":"bitcoincash:qq04t0jhllzztrh2ypxy88ujff5wqv0kpgra2gt40d","ticker":"TROUT","utxoTxid":"5dfd91589f1c0813154da4c2804fa38886cc2e47fa1d73cb8285df786a25c2cc","utxoVout":1,"tokenType":1,"dataType":"offer"},"timestamp":"2022-08-29T13:54:13.701Z","localTimeStamp":"8/29/2022, 6:54:13 AM"}'
  },
  __v: 0
}

export default {
  mockP2wdbRead
}
