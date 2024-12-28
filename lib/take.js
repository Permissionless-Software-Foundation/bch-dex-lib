/*
  This class library governs the action of Takers or *take* and Offer by
  generating an Counter Offer and uploading it to the P2WDB.
*/

// Global npm libraries
// const RetryQueue = require('@chris.troutner/retry-queue-commonjs')
import RetryQueue from '@chris.troutner/retry-queue'

// Local libraries
import BchDexUtil from './bch-dex-util.js'
import NostrAdapter from './adapters/nostr.js'

class Take {
  constructor (localConfig = {}) {
    // Dependency injection
    if (!localConfig.bchWallet) {
      throw new Error('Instance of minimal-slp-wallet must be passed as wallet property when instantiating Take library.')
    }
    this.bchWallet = localConfig.bchWallet
    if (!localConfig.p2wdbRead) {
      throw new Error('Instance of p2wdb Read must be passed as p2wdbRead property when instantiating Take library.')
    }
    this.p2wdbRead = localConfig.p2wdbRead
    if (!localConfig.p2wdbWrite) {
      throw new Error('Instance of p2wdb Write must be passed as p2wdbWrite property when instantiating Take library.')
    }
    this.p2wdbWrite = localConfig.p2wdbWrite

    // Encapsulate dependencies
    this.util = new BchDexUtil(localConfig)
    this.retryQueue = new RetryQueue({ attempts: 3, retryPeriod: 1000 })
    // console.log('NostrAdapter: ', NostrAdapter)
    this.nostr = new NostrAdapter({
      nostrRelay: 'wss://nostr-relay.psfoundation.info',
      nostrTopic: 'bch-dex-test-topic-01'
    })

    // Bind 'this' object to all subfunctions
    this.takeOffer = this.takeOffer.bind(this)
    this.moveBch = this.moveBch.bind(this)
    this.generatePartialTx = this.generatePartialTx.bind(this)
    this.uploadCounterOffer = this.uploadCounterOffer.bind(this)
    this.uploadCounterOffer2 = this.uploadCounterOffer2.bind(this)
    this.ensureFunds = this.ensureFunds.bind(this)
  }

  // This is a top-level function that orchestrates several subfunctions, in
  // order to generate a Counter Offer.
  async takeOffer (cid) {
    try {
      // Get the Offer from the P2WDB.
      // const offerData = await this.util.getEntryFromP2wdb(cid)
      // const offerData = await this.retryQueue.addToQueue(this.util.getEntryFromP2wdb, cid)
      const offerData = await this.retryQueue.addToQueue(this.util.getEntryFromNostr, cid)
      console.log('offerData: ', offerData)

      // Verify the UTXO is still valid.
      const utxo = {
        tx_hash: offerData.utxoTxid,
        tx_pos: offerData.utxoVout
      }
      // const isValid = await this.util.validateUtxo(utxo)
      const isValid = await this.retryQueue.addToQueue(this.util.validateUtxo, utxo)
      if (!isValid) {
        throw new Error('Offer is not valid. UTXO has been spent.')
      }

      // Ensure the wallet has enough funds to complete the trade.
      const { hasEnoughFunds, bchAddr } = await this.retryQueue.addToQueue(this.ensureFunds, offerData)
      console.log('bchAddr: ', bchAddr)
      if (!hasEnoughFunds) {
        throw new Error('This wallet does not have enough BCH to Counter the selected Offer.')
      }

      // Move BCH to a new HD wallet address
      const utxoInfo = await this.retryQueue.addToQueue(this.moveBch, offerData)
      console.log('Counter Offer UTXO: ', utxoInfo)

      // Generate a partially signed TX and Counter Offer
      const offerInfo = offerData
      const hex = await this.retryQueue.addToQueue(this.generatePartialTx, { offerInfo, utxoInfo })
      console.log('partial tx hex: ', hex)

      const partialHex = hex
      return { offerData, partialHex }

      // Initialize the Nostr adapter
      // const wif = utxoInfo.wif
      // await this.nostr.start(wif)

      // // Upload the Counter Offer to a Nostr relay
      // const offerCid = cid
      // const partialHex = hex
      // const {eventId, noteId} = await this.retryQueue.addToQueue(this.uploadCounterOffer2, { offerData, partialHex })
      // // console.log(`Counter Offer uploaded to Nostr with this event ID: ${eventId}`)
      // // console.log(`https://astral.psfoundation.info/${noteId}`)

      // return {eventId, noteId}
    } catch (err) {
      console.error('Error in bch-dex-lib/take.js takeOffer(): ', err)
      throw err
    }
  }

  // Generate a Counter Offer and upload it to the P2WDB.
  async uploadCounterOffer (inObj = {}) {
    try {
      const { offerData, partialHex, offerCid } = inObj

      console.log(`uploadCounterOffer() offerData: ${JSON.stringify(offerData, null, 2)}`)

      // Scaffold the Counter Offer from the Offer
      const counterOfferData = Object.assign({}, offerData.data)
      counterOfferData.partialTxHex = partialHex
      delete counterOfferData.p2wdbHash
      delete counterOfferData._id
      counterOfferData.offerHash = offerCid

      // Add P2WDB specific flag for signaling that this is a new Counter Offer.
      counterOfferData.dataType = 'counter-offer'
      console.log(`counterOfferData: ${JSON.stringify(counterOfferData, null, 2)}`)

      // Refresh the UTXOs in the local P2WDB wallet.
      await this.p2wdbWrite.bchWallet.initialize()

      // Write the data to the P2WDB.
      const hash = await this.p2wdbWrite.postEntry(counterOfferData, offerData.appId)

      return hash
    } catch (err) {
      console.error('Error in uploadCounterOffer(): ', err)
      throw err
    }
  }

  // Generate a Counter Offer and upload it to Nostr
  async uploadCounterOffer2 (inObj = {}) {
    try {
      const { offerData, partialHex } = inObj

      console.log(`uploadCounterOffer2() offerData: ${JSON.stringify(offerData, null, 2)}`)

      // Scaffold the Counter Offer from the Offer
      const counterOfferData = Object.assign({}, offerData)
      counterOfferData.partialTxHex = partialHex
      delete counterOfferData.nostrEventId
      delete counterOfferData._id
      counterOfferData.offerHash = offerData.nostrEventId

      // Add P2WDB specific flag for signaling that this is a new Counter Offer.
      counterOfferData.dataType = 'counter-offer'
      console.log(`counterOfferData: ${JSON.stringify(counterOfferData, null, 2)}`)

      const nostrData = {
        data: counterOfferData
      }
      const resultEventId = await this.nostr.post(JSON.stringify(nostrData))
      // const resultEventId = 'fake-event-ID'

      const noteId = this.nostr.eventId2note(resultEventId)

      return { eventId: resultEventId, noteId }
    } catch (err) {
      console.error('Error in uploadCounterOffer2(): ', err)
      throw err
    }
  }

  // Generate a partial transaction to *take* a 'sell' offer.
  async generatePartialTx (inObj = {}) {
    try {
      const { offerInfo, utxoInfo } = inObj

      // console.log(`offerInfo: ${JSON.stringify(offerInfo, null, 2)}`)

      const bchjs = this.bchWallet.bchjs

      // instance of transaction builder
      const transactionBuilder = new bchjs.TransactionBuilder()

      // Get token info on the offered UTXO
      const txData = await this.bchWallet.getTxData([offerInfo.utxoTxid])
      // console.log(`txData: ${JSON.stringify(txData, null, 2)}`)

      // Construct the UTXO being offered for sale.
      const offeredUtxo = {
        txid: offerInfo.utxoTxid,
        vout: offerInfo.utxoVout,
        tokenId: offerInfo.tokenId,
        decimals: txData[0].tokenDecimals,
        tokenQty: offerInfo.numTokens.toString()
      }
      // console.log(`offeredUtxo: ${JSON.stringify(offeredUtxo, null, 2)}`)

      // Build First part of the collaborative Tx a.k.a. Alice
      // Generate the OP_RETURN code.
      let slpSendObj
      if (offerInfo.tokenType === 65) {
      // Type 65 NFT

        slpSendObj = bchjs.SLP.NFT1.generateNFTChildSendOpReturn(
          [offeredUtxo],
          offerInfo.numTokens.toString()
        )
      // console.log(`slpOutputs: ${slpSendObj.outputs}`)
      } else if (offerInfo.tokenType === 1) {
      // Type 1 fungible token

        slpSendObj = bchjs.SLP.TokenType1.generateSendOpReturn(
          [offeredUtxo],
          offerInfo.numTokens.toString()
        )
      // console.log(`slpOutputs: ${slpSendObj.outputs}`)
      // console.log(`slpSendObj: `, slpSendObj)
      } else {
        throw new Error(`Unknown token type of ${offerInfo.tokenType}. Can not create Counter Offer.`)
      }
      const slpData = slpSendObj.script

      // Currently this app only supports a single SLP token UTXO for exact
      // token quantities (no token change). e.g. 1 UTXO representing the
      // exact number of 'numTokens'
      if (slpSendObj.outputs > 1) {
      // console.log('WARNING: choose one UTXO with all tokens to exchange')
        throw new Error('Partial purchase of Offers is not yet supported')
      }

      // Calculate sats needed to pay the offer.
      const satsNeeded = Math.ceil(offerInfo.numTokens * parseInt(offerInfo.rateInBaseUnit))
      if (isNaN(satsNeeded)) throw new Error('Can not calculate needed sats')

      // add UTXO for sale (STILL CANNOT SPEND - not signed yet)
      transactionBuilder.addInput(offerInfo.utxoTxid, offerInfo.utxoVout)

      // add payment UTXO
      // transactionBuilder.addInput(paymentUtxo.tx_hash, paymentUtxo.tx_pos)
      transactionBuilder.addInput(utxoInfo.txid, utxoInfo.vout)

      // const originalAmount = paymentUtxo.value
      const dust = 546
      // const remainder = originalAmount - satsNeeded - dust // exchange fee + token UTXO dust

      // Add the SLP OP_RETURN data as the first output.
      transactionBuilder.addOutput(slpData, 0)

      const buyerAddr = this.bchWallet.walletInfo.legacyAddress
      console.log(`buyerAddr: ${JSON.stringify(buyerAddr, null, 2)}`)
      const buyerAddrLegacy = bchjs.Address.toLegacyAddress(buyerAddr)
      console.log(`buyerAddrLegacy: ${buyerAddrLegacy}`)

      // Send dust transaction representing tokens being sent.
      transactionBuilder.addOutput(
        buyerAddrLegacy,
        dust
      )

      // Get seller address
      const sellerAddr = offerInfo.makerAddr

      // Send payment to the offer side
      transactionBuilder.addOutput(sellerAddr, satsNeeded)

      // Send the BCH change back to the buyer
      // if (remainder > 550) {
      //   transactionBuilder.addOutput(buyerAddr, remainder)
      // }

      // const buyerECPair = bchjs.ECPair.fromWIF(this.bchWallet.walletInfo.privateKey)
      const buyerECPair = bchjs.ECPair.fromWIF(utxoInfo.wif)

      // Sign the buyers input UTXO for spending.
      transactionBuilder.sign(
        1,
        buyerECPair,
        null,
        transactionBuilder.hashTypes.SIGHASH_ALL,
        utxoInfo.sats
      )

      const tx = transactionBuilder.transaction.buildIncomplete()

      const hex = tx.toHex()
      // console.log('hex: ', hex)

      return hex
    } catch (err) {
      console.error('Error in generatePartialTx(): ', err)
      throw err
    }
  }

  // Move BCH to a new address in the HD wallet. Default to the second address
  // (index 1) if not specified.
  async moveBch (offerData = {}, hdIndex = 1) {
    // Calculate amount of sats to generate a counter offer.
    let satsToMove = Math.ceil(offerData.numTokens * parseInt(offerData.rateInBaseUnit))
    if (isNaN(satsToMove)) {
      throw new Error('Could not calculate the amount of BCH to generate counter offer')
    }

    // Add sats to cover mining fees and dust for token UTXO
    satsToMove += 1000

    // Generate a new key pair to store the BCH being offered in the Counter Offer.
    // The UTXO is not created in the regular address, because the wallet might
    // accidentally spend it before the Maker to Accept the Counter Offer.
    const keyPair = await this.util.getKeyPair(hdIndex)

    // Generate a receiver object for minimal-slp-wallet.
    const receivers = [{
      address: keyPair.cashAddress,
      amountSat: satsToMove
    }]
    console.log(`receivers: ${JSON.stringify(receivers, null, 2)}`)

    // Update the UTXO store of the wallet.
    await this.bchWallet.getUtxos()

    // Send the BCH to the selected holding address.
    const txid = await this.bchWallet.send(receivers)

    // Generaate UTXO information for transfered BCH. This will be used to
    // construct a partial transaction, which is the core part of a Counter Offer.
    const utxoInfo = {
      txid,
      vout: 0,
      hdIndex: keyPair.hdIndex,
      wif: keyPair.wif,
      sats: satsToMove
    }

    console.log(`BCH moved to ${keyPair.cashAddress} with WIF ${keyPair.wif}`)

    return utxoInfo
  }

  // Ensure that the wallet has enough BCH to complete the requested
  // trade. Will return true if it does. Will throw an error if it doesn't.
  async ensureFunds (offerData) {
    // console.log('ensureFunds() offerData: ', offerData)

    // Ensure the app wallet has enough funds to write to the P2WDB.
    const { hasEnoughPsf, hasEnoughBch, bchAddr } = await this.p2wdbWrite.checkForSufficientFunds()
    if (!hasEnoughPsf && !hasEnoughBch) {
      throw new Error('Wallet does not have enough BCH to write to the P2WDB.')
    }
    // console.log('hasEnoughBch: ', hasEnoughBch)
    console.log('ensureFunds() bchAddr: ', bchAddr)

    // Convert BCH cost to sats.
    let hasEnoughSats = 0
    if (hasEnoughBch) {
      hasEnoughSats = this.bchWallet.bchjs.BitcoinCash.toSatoshi(hasEnoughBch)
    }

    if (offerData.buyOrSell.includes('sell')) {
      // Sell Offer

      // Calculate the sats needed
      const satsNeeded = Math.ceil(offerData.numTokens * parseInt(offerData.rateInBaseUnit))
      if (isNaN(satsNeeded)) {
        throw new Error('Could not calculate sats needed!')
      }

      // Ensure the app wallet controlls enough BCH to pay for the tokens.
      const balance = await this.bchWallet.getBalance()
      console.log(`wallet balance: ${balance}, sats needed: ${satsNeeded}`)
      const SATS_MARGIN = 5000
      const totalSatsNeeded = satsNeeded + SATS_MARGIN + hasEnoughSats
      if (totalSatsNeeded > balance) {
        throw new Error(`Wallet does not control enough BCH to purchase the tokens. It has ${balance} sats, and needs ${totalSatsNeeded} sats.`)
      }

    //
    } else {
      // Buy Offer
      throw new Error('Buy offers are not supported yet.')
    }

    return { hasEnoughFunds: true, bchAddr }
  }
}

export default Take
