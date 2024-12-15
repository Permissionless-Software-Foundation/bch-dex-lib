/*
  Unit tests for the take.js library.
*/

// Global npm libraries
// const assert = require('chai').assert
// const sinon = require('sinon')
// const cloneDeep = require('lodash.clonedeep')
// const BchWallet = require('minimal-slp-wallet')
import { assert } from 'chai'
import BchWallet from 'minimal-slp-wallet'
import sinon from 'sinon'
import cloneDeep from 'lodash.clonedeep'

// Mocking data libraries.
// const mockDataLib = require('./mocks/token-data-mocks.js')
import mockDataLib from './mocks/token-data-mocks.js'

// Unit under test
// const TokenData = require('../../lib/token-data.js')
import TokenData from '../../lib/token-data.js'
let uut

describe('#token-data.js', () => {
  let sandbox
  let mockData

  before(async () => {
    const bchWallet = new BchWallet(undefined, { interface: 'consumer-api' })
    await bchWallet.walletInfoPromise

    uut = new TokenData({ bchWallet })
  })

  beforeEach(() => {
    // Restore the sandbox before each test.
    sandbox = sinon.createSandbox()

    // Clone the mock data.
    mockData = cloneDeep(mockDataLib)
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw error if instance of minimal-slp-wallet is not passed', () => {
      try {
        uut = new TokenData({})

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'Instance of minimal-slp-wallet must be passed as wallet property when instantiating TokenData library.')
      }
    })
  })

  describe('#getTokenData', () => {
    it('should call callback function after downloading token data', async () => {
      // Mock dependencies and force desired code path
      sandbox.stub(uut.bchWallet, 'getTokenData2').resolves(mockData.tokenData01)

      const tokenId = 'd6073900bf75acfdb26314bb1c59ce12e223c31152eded1d20e9ca9b2d453f5c'

      const cb = (offer) => {
        // console.log('offer: ', offer)

        assert.property(offer.tokenData, 'tokenStats')
        assert.property(offer.tokenData, 'tokenIcon')
        assert.property(offer.tokenData, 'optimizedTokenIcon')
      }

      const result = await uut.getTokenData({ tokenId }, cb)

      assert.equal(result, true)
    })

    it('should throw an error if no token ID argument is passed', async () => {
      try {
        await uut.getTokenData()

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'offer input object must contain a tokenId property when calling getTokenData()')
      }
    })

    it('should throw an error if callback function is passed', async () => {
      try {
        await uut.getTokenData({ tokenId: 'abc123' })

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'callbackFunc required when calling getTokenData()')
      }
    })

    it('should return data from the cache if the data exists', async () => {
      // Mock dependencies and force desired code path
      sandbox.stub(uut.bchWallet, 'getTokenData2').resolves(mockData.tokenData01)

      const tokenId = 'd6073900bf75acfdb26314bb1c59ce12e223c31152eded1d20e9ca9b2d453f5c'

      let cnt = 0

      const cb = (offer) => {
        // console.log('offer: ', offer)

        cnt++

        if (cnt === 1) {
          assert.property(offer.tokenData, 'tokenStats')
          assert.property(offer.tokenData, 'tokenIcon')
          assert.property(offer.tokenData, 'optimizedTokenIcon')
        } else if (cnt === 2) {
          // Token ID should exist in the cache array on the second call.
          assert.equal(uut.tokenIdsCache.includes(offer.tokenId), true)
        }
      }

      await uut.getTokenData({ tokenId }, cb)
      await uut.getTokenData({ tokenId }, cb)
      // console.log('result: ', result)

      // assert.equal(result, true)
    })
  })
})
