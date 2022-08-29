/*
  Integration tests for the util.js utility library.
*/

// Global libraries
const assert = require('chai').assert
const BchWallet = require('minimal-slp-wallet/index')
const { Read } = require('p2wdb/index')

// Unit under test
const BchDexUtil = require('../../lib/bch-dex-util')

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
      const cid = 'zdpuB1JpvAb6t1Zrj7N7JVg3WTQ3ZEfoZ43nV6cWwLgNpB2gy'

      const result = await uut.getEntryFromP2wdb(cid)
      // console.log('result: ', result)

      assert.property(result, 'isValid')
      assert.property(result, 'value')
    })
  })
})
