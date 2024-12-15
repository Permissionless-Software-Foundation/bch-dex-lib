/*
  Integration tests for the token-data.js library.
*/

// Global libraries
// const assert = require('chai').assert
// const BchWallet = require('minimal-slp-wallet')
import { assert } from 'chai'
import BchWallet from 'minimal-slp-indexer'

// Unit under test
// const TokenData = require('../../lib/token-data.js')
import TokenData from '../../lib/token-data.js'

// Global variables
let uut

describe('#token-data.js', () => {
  before(async () => {
    const bchWallet = new BchWallet(undefined, { interface: 'consumer-api' })
    await bchWallet.walletInfoPromise

    uut = new TokenData({ bchWallet })
  })

  describe('#getTokenData', () => {
    it('should resolve data for USDt', async () => {
      const tokenId = '9fc89d6b7d5be2eac0b3787c5b8236bca5de641b5bafafc8f450727b63615c11'

      const cb = (offer) => {
        console.log('offer: ', offer)

        assert.property(offer.tokenData, 'tokenStats')
        assert.property(offer.tokenData, 'tokenIcon')
        assert.property(offer.tokenData, 'optimizedTokenIcon')

        assert.equal(offer.tokenData.iconRepoCompatible, true)
        assert.equal(offer.tokenData.ps002Compatible, false)
      }

      const result = await uut.getTokenData({ tokenId }, cb)
      console.log('result: ', result)
    })

    it('should call callback function after downloading token data', async () => {
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
  })
})
