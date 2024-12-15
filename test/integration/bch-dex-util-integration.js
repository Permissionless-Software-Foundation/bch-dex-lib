/*
  Integration tests for the util.js utility library.
*/

// Global libraries
// const assert = require('chai').assert
// const BchWallet = require('minimal-slp-wallet/index')
// const { Read } = require('p2wdb/index')

import { assert } from 'chai'
import BchWallet from 'minimal-slp-indexer'
import { Read } from 'p2wdb'

// Unit under test
// const BchDexUtil = require('../../lib/bch-dex-util')
import BchDexUtil from '../../lib/bch-dex-util.js'

// Global variables
let uut

describe('#bch-dex-util.js', () => {
  before(async () => {
    const wallet = new BchWallet(undefined, { interface: 'consumer-api' })
    await wallet.walletInfoPromise
    const p2wdbRead = new Read()

    uut = new BchDexUtil({ wallet, p2wdbRead })
  })

  describe('#getEntryFromP2wdb', async () => {
    it('should get an entry from the P2WDB', async () => {
      const cid = 'zdpuAv1tCSRBrWcG9oisXTMD5mKCUHqivu1StSu18Dexcw87B'

      const result = await uut.getEntryFromP2wdb(cid)
      // console.log('result: ', result)

      assert.property(result, 'appId')
      assert.property(result, 'data')
    })
  })

  describe('#validateUtxo', () => {
    it('should return true for an unspent UTXO', async () => {
      const txHash = 'b94e1ff82eb5781f98296f0af2488ff06202f12ee92b0175963b8dba688d1b40'
      const txPos = 0

      const result = await uut.validateUtxo(txHash, txPos)
      // console.log('result: ', result)

      assert.equal(result, true)
    })
  })
})
