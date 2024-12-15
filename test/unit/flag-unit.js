/*
  Unit tests for the take.js library.
*/

// Global npm libraries
// const assert = require('chai').assert
// const sinon = require('sinon')
// const cloneDeep = require('lodash.clonedeep')
// const BchWallet = require('minimal-slp-wallet')
// const { Write } = require('p2wdb')

import { assert } from 'chai'
import BchWallet from 'minimal-slp-wallet'
import P2WDB from 'p2wdb'
import sinon from 'sinon'

// Mocking data libraries.
// const mockDataLib = require('./mocks/take-mocks')

// Unit under test
// const Flag = require('../../lib/flag')
import Flag from '../../lib/flag.js'
let uut

const Write = P2WDB.Write

describe('#flag.js', () => {
  let sandbox

  before(async () => {
    const bchWallet = new BchWallet(undefined, { interface: 'consumer-api' })
    await bchWallet.walletInfoPromise
    // const p2wdbRead = new Read()

    // const wif = 'L1tcvcqa5PztqqDH4ZEcUmHA9aSHhTau5E2Zwp1xEK5CrKBrjP3m'
    const p2wdbWrite = new Write({ bchWallet })

    uut = new Flag({ bchWallet, p2wdbWrite })
  })

  beforeEach(() => {
    // Restore the sandbox before each test.
    sandbox = sinon.createSandbox()

    // Clone the mock data.
    // mockData = cloneDeep(mockDataLib)
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw error if instance of minimal-slp-wallet is not passed', () => {
      try {
        uut = new Flag({})

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'Instance of minimal-slp-wallet must be passed as wallet property when instantiating Flag library.')
      }
    })

    it('should throw error if instance of p2wdb Write lib is not passed', async () => {
      try {
        const bchWallet = new BchWallet(undefined, { interface: 'consumer-api' })
        await bchWallet.walletInfoPromise

        uut = new Flag({ bchWallet })

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'Instance of p2wdb Write must be passed as p2wdbWrite property when instantiating Flag library.')
      }
    })
  })

  describe('#flagOffer', () => {
    it('should flag Offer by writing to P2WDB', async () => {
      // Mock dependencies
      sandbox.stub(uut.p2wdbWrite.bchWallet, 'initialize').resolves()
      sandbox.stub(uut.p2wdbWrite, 'postEntry').resolves('fake-hash')

      const fakeCid = 'fake-cid'

      const result = await uut.flagOffer(fakeCid)

      assert.equal(result, 'fake-hash')
    })
  })
})
