/*
  This class library allows users to 'flag' an NFT in the marketplace as
  'not safe for work' (NSFW), by writing an entry to the P2WDB.
*/

// Local libraries
// const BchDexUtil = require('./bch-dex-util')

const APP_ID = 'bch-dex-001'

class Flag {
  constructor (localConfig = {}) {
    // Dependency injection
    if (!localConfig.bchWallet) {
      throw new Error('Instance of minimal-slp-wallet must be passed as wallet property when instantiating Flag library.')
    }
    this.bchWallet = localConfig.bchWallet
    if (!localConfig.p2wdbWrite) {
      throw new Error('Instance of p2wdb Write must be passed as p2wdbWrite property when instantiating Flag library.')
    }
    this.p2wdbWrite = localConfig.p2wdbWrite

    // Encapsulate dependencies
    // this.util = new BchDexUtil(localConfig)
  }

  // Flag an offer as NSFW
  async flagOffer (zcid) {
    try {
      const data = {
        p2wdbHash: zcid,
        nsfw: true,
        dataType: 'flag'
      }

      // Refresh the UTXOs in the local P2WDB wallet.
      await this.p2wdbWrite.bchWallet.initialize()

      // Write the data to the P2WDB.
      const hash = await this.p2wdbWrite.postEntry(data, APP_ID)

      return hash
    } catch (err) {
      console.error('Error in bch-dex-lib/flag.js flagOffer(): ', err)
      throw err
    }
  }
}

// module.exports = Flag
export default Flag
