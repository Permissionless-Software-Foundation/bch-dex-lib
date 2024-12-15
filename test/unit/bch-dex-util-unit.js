/*
  Unit tests for the util.js utility library.
*/

// Global npm libraries
// const assert = require('chai').assert
// const sinon = require('sinon')
// const cloneDeep = require('lodash.clonedeep')
// const BchWallet = require('minimal-slp-wallet')
// const { Read } = require('p2wdb')

import { assert } from 'chai'
import BchWallet from 'minimal-slp-wallet'
// import { Read } from 'p2wdb'
import cloneDeep from 'lodash.clonedeep'
import sinon from 'sinon'

// Mocking data libraries.
// const mockDataLib = require('./mocks/util-mocks')
import mockDataLib from './mocks/util-mocks.js'

// Unit under test
// const BchDexUtil = require('../../lib/bch-dex-util')
import BchDexUtil from '../../lib/bch-dex-util.js'

import P2WDB from 'p2wdb'
const Read = P2WDB.Read

let uut

describe('#bch-dex-util.js', () => {
  let sandbox, mockData

  beforeEach(async () => {
    const bchWallet = new BchWallet(undefined, { interface: 'consumer-api' })
    await bchWallet.walletInfoPromise
    const p2wdbRead = new Read()

    uut = new BchDexUtil({ bchWallet, p2wdbRead })

    // Restore the sandbox before each test.
    sandbox = sinon.createSandbox()

    // Clone the mock data.
    mockData = cloneDeep(mockDataLib)
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw error if instance of minimal-slp-wallet is not passed', () => {
      try {
        uut = new BchDexUtil({})

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'Instance of minimal-slp-wallet must be passed as wallet property when instantiating bch-dex-util library.')
      }
    })

    it('should throw error if instance of p2wdb Read lib is not passed', async () => {
      try {
        const bchWallet = new BchWallet(undefined, { interface: 'consumer-api' })
        await bchWallet.walletInfoPromise
        uut = new BchDexUtil({ bchWallet })

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'Instance of p2wdb Read must be passed as p2wdbRead property when instantiating bch-dex-util library.')
      }
    })
  })

  describe('#getEntryFromP2wdb', async () => {
    it('should get an entry from the P2WDB', async () => {
      // Mock dependencies
      sandbox.stub(uut.p2wdbRead, 'getByHash').resolves(mockData.mockP2wdbRead)

      const cid = 'zdpuB1JpvAb6t1Zrj7N7JVg3WTQ3ZEfoZ43nV6cWwLgNpB2gy'

      const result = await uut.getEntryFromP2wdb(cid)
      // console.log('result: ', result)

      assert.property(result, 'appId')
      assert.property(result, 'data')
    })

    it('should handle data that is already parsed', async () => {
      // Force desired code path
      mockData.mockP2wdbRead.value.data = JSON.parse(mockData.mockP2wdbRead.value.data)

      // Mock dependencies
      sandbox.stub(uut.p2wdbRead, 'getByHash').resolves(mockData.mockP2wdbRead)

      const cid = 'zdpuB1JpvAb6t1Zrj7N7JVg3WTQ3ZEfoZ43nV6cWwLgNpB2gy'

      const result = await uut.getEntryFromP2wdb(cid)
      // console.log('result: ', result)

      assert.property(result, 'appId')
      assert.property(result, 'data')
    })
  })

  describe('#validateUtxo', () => {
    it('should return true on valid UTXO', async () => {
      // Mock dependencies
      sandbox.stub(uut.bchWallet, 'utxoIsValid').resolves(true)

      const txHash = 'b94e1ff82eb5781f98296f0af2488ff06202f12ee92b0175963b8dba688d1b40'
      const txPos = 0

      const utxo = {
        tx_hash: txHash,
        tx_pos: txPos
      }

      const result = await uut.validateUtxo(utxo)
      // console.log('result: ', result)

      assert.equal(result, true)
    })
  })

  describe('#getKeyPair', () => {
    it('should return an object with a key pair', async () => {
      const result = await uut.getKeyPair()
      // console.log('result: ', result)

      assert.property(result, 'cashAddress')
      assert.property(result, 'wif')
      assert.property(result, 'hdIndex')
    })

    it('should throw an error if wallet does not have a mnemonic', async () => {
      try {
        uut.bchWallet.walletInfo.mnemonic = ''

        await uut.getKeyPair()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'Wallet does not have a mnemonic. Can not generate a new key pair.')
      }
    })
  })
})
