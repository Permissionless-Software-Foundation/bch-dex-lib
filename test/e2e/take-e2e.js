/*
  The tests in this file require a wallet with BCH.
*/

// Global npm libraries
// const BchWallet = require('minimal-slp-wallet/index')
// const { Read, Write } = require('p2wdb/index')

import BchWallet from 'minimal-slp-wallet'
import { Read, Write } from 'p2wdb'

// Local libraries
// const Take = require('../../lib/take')
import Take from '../../lib/take.js'
// const mockData = require('../unit/mocks/take-mocks')

describe('#take.js', () => {
  // describe('#ensureFunds', () => {
  //   it('should return true if a wallet has some BCH', async () => {
  //     // Ensure the wallet below has at least 25,000 sats, and no PSF tokens.
  //
  //     const WIF = 'L1tcvcqa5PztqqDH4ZEcUmHA9aSHhTau5E2Zwp1xEK5CrKBrjP3m'
  //     // BCH Address: bitcoincash:qqkg30ryje97al52htqwvveha538y7gttywut3cdqv
  //     // SLP Address: simpleledger:qqkg30ryje97al52htqwvveha538y7gttyz8q2dd7j
  //
  //     const wallet = new BchWallet(WIF, { interface: 'consumer-api' })
  //     await wallet.walletInfoPromise
  //     const p2wdbRead = new Read()
  //     const p2wdbWrite = new Write({ wif: WIF, interface: 'consumer-api' })
  //
  //     const take = new Take({ wallet, p2wdbRead, p2wdbWrite })
  //
  //     const result = await take.ensureFunds(mockData.offerData01)
  //     console.log('result: ', result)
  //   })
  // })

  // describe('#generatePartialTx', () => {
  //   it('should generate a partial transaction', async () => {
  //     const mnemonic = 'gaze result fortune pulse jeans lucky tape build maximum puppy urban size'
  //
  //     const wallet = new BchWallet(mnemonic, { interface: 'consumer-api' })
  //     await wallet.walletInfoPromise
  //     const p2wdbRead = new Read()
  //     const p2wdbWrite = new Write({ wif: wallet.walletInfo.privateKey, interface: 'consumer-api' })
  //
  //     const take = new Take({ wallet, p2wdbRead, p2wdbWrite })
  //
  //     const offerInfo = {
  //       appId: 'bch-dex-001',
  //       data: {
  //         messageType: 1,
  //         messageClass: 1,
  //         tokenId: '95ad948d454404fd7efe26789738da6d598f2718e141563c3ae17e84100e4417',
  //         buyOrSell: 'sell',
  //         rateInBaseUnit: 8599,
  //         minUnitsToExchange: 8599,
  //         numTokens: 1,
  //         makerAddr: 'bitcoincash:qrqlz63cwmu0hcmsrfnd8jemn3atkpaqds6tf4ksrr',
  //         ticker: 'XPHX',
  //         utxoTxid: '87b55ec6ba6f1ee4ac48ccb59b0cbe4b22aadeb607e8077c87d81e2c13b6e48b',
  //         utxoVout: 1,
  //         tokenType: 1,
  //         dataType: 'offer'
  //       },
  //       timestamp: '2022-08-28T23:35:39.888Z',
  //       localTimeStamp: '8/28/2022, 11:35:39 PM'
  //     }
  //
  //     const utxoInfo = {
  //       txid: 'a1971eeb12a9d7d361cb665fcc1791b8dd23cab458ef72f4c61dbb6d355b495c',
  //       vout: 0,
  //       hdIndex: 1,
  //       wif: 'L2maHmC39fFfjT8yFYjzagQJqNeQKFeRZaUgFRtR1QCgwUjcdAWB',
  //       sats: 9599
  //     }
  //
  //     const result = await take.generatePartialTx(offerInfo, utxoInfo)
  //     console.log('result: ', result)
  //   })
  // })

  describe('#takeOffer', () => {
    it('should create a Counter Offer', async () => {
      // Customize the two variables below for your own test. The mnemonic
      // should control about $0.20 USD of BCH. The p2wdbHash should be for a
      // valid Offer in the market.
      const mnemonic = 'gaze result fortune pulse jeans lucky tape build maximum puppy urban size'
      const p2wdbHash = 'zdpuAvWMYm7bfHTxbNwsWYmrkK3cnhtH2MzQ7QS74uYbkM3ja'

      const wallet = new BchWallet(mnemonic, { interface: 'consumer-api' })
      await wallet.walletInfoPromise
      const p2wdbRead = new Read()
      const p2wdbWrite = new Write({ wif: wallet.walletInfo.privateKey, interface: 'consumer-api' })

      const take = new Take({ wallet, p2wdbRead, p2wdbWrite })

      const result = await take.takeOffer(p2wdbHash)
      console.log('result: ', result)
    })
  })
})
