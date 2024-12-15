/*
  Top level library file. This aggregates the other libraries into a single
  library file.
*/

// Local libraries
import Take from './lib/take.js'
import Flag from './lib/flag.js'
import TokenData from './lib/token-data.js'

// const BCHJS = require('@psf/bch-js')

// const Util = require('./lib/bch-dex-util')
// const util = new Util()

class BchDexLib {
  constructor (localConfig = {}) {
    // Dependency injection
    if (!localConfig.bchWallet) {
      throw new Error('Instance of minimal-slp-wallet must be passed as wallet property when instantiating the bch-dex-lib library.')
    }
    this.bchWallet = localConfig.bchWallet
    if (!localConfig.p2wdbRead) {
      throw new Error('Instance of p2wdb must be passed as wallet property when instantiating the bch-dex-lib library.')
    }
    this.p2wdbRead = localConfig.p2wdbRead
    if (!localConfig.p2wdbWrite) {
      throw new Error('Instance of p2wdb Write must be passed as p2wdbWrite property when instantiating the bch-dex-lib library.')
    }
    this.p2wdbWrite = localConfig.p2wdbWrite

    const depenencies = {
      bchWallet: this.bchWallet,
      p2wdbRead: this.p2wdbRead,
      p2wdbWrite: this.p2wdbWrite
    }

    // Encapsulate dependencies
    this.take = new Take(depenencies)
    this.flag = new Flag(depenencies)
    this.tokenData = new TokenData(depenencies)
  }
}

export default BchDexLib
