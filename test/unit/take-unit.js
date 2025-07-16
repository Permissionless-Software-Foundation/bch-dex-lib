/*
  Unit tests for the take.js library.
*/

// Global npm libraries
// const assert = require('chai').assert
// const sinon = require('sinon')
// const cloneDeep = require('lodash.clonedeep')
// const BchWallet = require('minimal-slp-wallet')
// const { Read, Write } = require('p2wdb')

import { assert } from 'chai'
import BchWallet from 'minimal-slp-wallet'
import P2WDB from 'p2wdb'
import sinon from 'sinon'
import cloneDeep from 'lodash.clonedeep'

// Mocking data libraries.
// const mockDataLib = require('./mocks/take-mocks')
// const offerMocks = require('./mocks/offer-mocks')
import mockDataLib from './mocks/take-mocks.js'
import offerMocks from './mocks/offer-mocks.js'

// Unit under test
// const Take = require('../../lib/take')
import Take from '../../lib/take.js'
let uut

const Read = P2WDB.Read
const Write = P2WDB.Write

describe('#take.js', () => {
  let sandbox, mockData

  before(async () => {
    const bchWallet = new BchWallet(undefined, { interface: 'consumer-api' })
    await bchWallet.walletInfoPromise
    const p2wdbRead = new Read()

    // const wif = 'L1tcvcqa5PztqqDH4ZEcUmHA9aSHhTau5E2Zwp1xEK5CrKBrjP3m'
    const p2wdbWrite = new Write({ bchWallet })

    uut = new Take({ bchWallet, p2wdbRead, p2wdbWrite })
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
        uut = new Take({})

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'Instance of minimal-slp-wallet must be passed as wallet property when instantiating Take library.')
      }
    })

    it('should throw error if instance of p2wdb Read lib is not passed', async () => {
      try {
        const bchWallet = new BchWallet(undefined, { interface: 'consumer-api' })
        await bchWallet.walletInfoPromise

        uut = new Take({ bchWallet })

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'Instance of p2wdb Read must be passed as p2wdbRead property when instantiating Take library.')
      }
    })

    it('should throw error if instance of p2wdb Write lib is not passed', async () => {
      try {
        const bchWallet = new BchWallet(undefined, { interface: 'consumer-api' })
        await bchWallet.walletInfoPromise
        const p2wdbRead = new Read()

        uut = new Take({ bchWallet, p2wdbRead })

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'Instance of p2wdb Write must be passed as p2wdbWrite property when instantiating Take library.')
      }
    })
  })

  describe('#ensureFunds', () => {
    it('should return true if WIF controls enough BCH and no PSF tokens', async () => {
      // Mock dependencies
      sandbox.stub(uut.p2wdbWrite, 'checkForSufficientFunds').resolves({
        hasEnoughPsf: false,
        hasEnoughBch: 0.00011074,
        bchAddr: 'bitcoincash:qpckjpvxwxmggdmqj35jkdhxqks9ku0q5gr7nc9yhf'
      })
      sandbox.stub(uut.bchWallet, 'getBalance').resolves(163456)

      const result = await uut.ensureFunds(mockData.offerData01)

      assert.equal(result.hasEnoughFunds, true)
      assert.include(result.bchAddr, 'bitcoincash:')
    })

    // it('should throw an error if wallet has no BCH or PSF tokens', async () => {
    //   try {
    //     // Force code path
    //     sandbox.stub(uut.p2wdbWrite, 'checkForSufficientFunds').resolves({
    //       hasEnoughPsf: false,
    //       hasEnoughBch: false,
    //       bchAddr: null
    //     })

    //     await uut.ensureFunds(mockData.offerData01)

    //     assert.fail('Unexpected result')
    //   } catch (err) {
    //     assert.include(err.message, 'Wallet does not have enough BCH to write to the P2WDB.')
    //   }
    // })

    it('should throw an error if satsNeeded can not be calculated', async () => {
      try {
        // Force code path
        sandbox.stub(uut.p2wdbWrite, 'checkForSufficientFunds').resolves({
          hasEnoughPsf: false,
          hasEnoughBch: 0.00011074,
          bchAddr: 'bitcoincash:qpckjpvxwxmggdmqj35jkdhxqks9ku0q5gr7nc9yhf'
        })
        sandbox.stub(uut.bchWallet, 'getBalance').resolves(163456)

        // Force code path
        mockData.offerData01.numTokens = 'a'

        await uut.ensureFunds(mockData.offerData01)

        assert.fail('Unexpected result')
      } catch (err) {
        console.log('err: ', err)
        assert.include(err.message, 'Could not calculate sats needed!')
      }
    })

    it('should throw an error if wallet does not have enough BCH', async () => {
      try {
        // Force code path
        sandbox.stub(uut.p2wdbWrite, 'checkForSufficientFunds').resolves({
          hasEnoughPsf: false,
          hasEnoughBch: 0.00011074,
          bchAddr: 'bitcoincash:qpckjpvxwxmggdmqj35jkdhxqks9ku0q5gr7nc9yhf'
        })
        sandbox.stub(uut.bchWallet, 'getBalance').resolves(9000)

        await uut.ensureFunds(mockData.offerData01)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'Wallet does not control enough BCH to purchase the tokens.')
      }
    })

    it('should throw an error for a "buy" Offer', async () => {
      try {
        // Force code path
        sandbox.stub(uut.p2wdbWrite, 'checkForSufficientFunds').resolves({
          hasEnoughPsf: false,
          hasEnoughBch: 0.00011074,
          bchAddr: 'bitcoincash:qpckjpvxwxmggdmqj35jkdhxqks9ku0q5gr7nc9yhf'
        })
        sandbox.stub(uut.bchWallet, 'getBalance').resolves(160000)

        // Force code path
        mockData.offerData01.buyOrSell = 'buy'

        await uut.ensureFunds(mockData.offerData01)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'Buy offers are not supported yet.')
      }
    })
  })

  describe('#moveBch', () => {
    it('should move BCH to the second HD address by default (index 1)', async () => {
      // Mock dependencies
      sandbox.stub(uut.bchWallet, 'getUtxos').resolves()
      sandbox.stub(uut.bchWallet, 'send').resolves('fake-txid')

      const result = await uut.moveBch(mockData.offerData01)

      assert.property(result, 'txid')
    })

    it('should throw an error if satsToMove can not be calculated correctly', async () => {
      try {
        mockData.offerData01.numTokens = 'a'

        await uut.moveBch(mockData.offerData01)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'Could not calculate the amount of BCH to generate counter offer')
      }
    })
  })

  describe('#generatePartialTx', () => {
    it('should generate a partial transaction for Type 1 token (fungible)', async () => {
      // Mock dependencies
      sandbox.stub(uut.bchWallet, 'getTxData').resolves(mockData.txData01)

      const inObj = {
        offerInfo: mockData.offerData02,
        utxoInfo: mockData.counterOfferUtxo01
      }

      const result = await uut.generatePartialTx(inObj)

      assert.include(result, '020000000')
    })

    it('should generate a partial transaction for Type 65 token (NFT)', async () => {
      // Mock dependencies
      sandbox.stub(uut.bchWallet, 'getTxData').resolves(mockData.txData01)

      // Force desired code path
      mockData.offerData02.tokenType = 65

      const inObj = {
        offerInfo: mockData.offerData02,
        utxoInfo: mockData.counterOfferUtxo01
      }

      const result = await uut.generatePartialTx(inObj)

      assert.include(result, '020000000')
    })

    it('should throw an error for unknown token types', async () => {
      try {
        // Mock dependencies
        sandbox.stub(uut.bchWallet, 'getTxData').resolves(mockData.txData01)

        // Force desired code path
        mockData.offerData02.tokenType = 14

        const inObj = {
          offerInfo: mockData.offerData02,
          utxoInfo: mockData.counterOfferUtxo01
        }

        await uut.generatePartialTx(inObj)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'Unknown token type of')
      }
    })

    it('should throw an error if token change is generated', async () => {
      try {
        // Mock dependencies
        sandbox.stub(uut.bchWallet, 'getTxData').resolves(mockData.txData01)

        // Force desired code path
        sandbox.stub(uut.bchWallet.bchjs.SLP.TokenType1, 'generateSendOpReturn').returns({
          script: Buffer.from('test'),
          outputs: 2
        })

        const inObj = {
          offerInfo: mockData.offerData02,
          utxoInfo: mockData.counterOfferUtxo01
        }

        await uut.generatePartialTx(inObj)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'Partial purchase of Offers is not yet supported')
      }
    })

    it('should throw an error if needed sats can not be calculated', async () => {
      try {
        // Mock dependencies
        sandbox.stub(uut.bchWallet, 'getTxData').resolves(mockData.txData01)

        // Force desired code path
        mockData.offerData02.rateInBaseUnit = 'a'

        const inObj = {
          offerInfo: mockData.offerData02,
          utxoInfo: mockData.counterOfferUtxo01
        }

        await uut.generatePartialTx(inObj)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'Can not calculate needed sats')
      }
    })
  })

  describe('#uploadCounterOffer', () => {
    it('should generate a Counter Offer and upload it to P2WDB', async () => {
      // Mock dependencies and force desired code path
      sandbox.stub(uut.p2wdbWrite.bchWallet, 'initialize').resolves()
      sandbox.stub(uut.p2wdbWrite, 'postEntry').resolves('fake-hash')

      const inObj = {
        offerData: offerMocks.simpleNftOffer01,
        partialHex: 'fake-hex',
        offerCid: 'fake-cid'
      }

      const result = await uut.uploadCounterOffer(inObj)

      assert.equal(result, 'fake-hash')
    })
  })
})
