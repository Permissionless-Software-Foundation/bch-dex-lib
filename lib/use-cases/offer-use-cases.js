/*
  PLACEHOLDER

  Offer Use Cases

  The Use Cases concept comes from Clean Architecture
  https://christroutner.github.io/trouts-blog/blog/clean-architecture
*/

// Local libraries
// const OfferEntity = require('../entities/offer-entity.js')
// const OfferCollectionEntity = require('../entities/offer-collection-entity.js')

import OfferEntity from '../entities/offer-entity.js'
import OfferCollectionEntity from '../entities/offer-collection-entity.js'

class OfferUseCases {
  constructor (localConfig = {}) {
    // Encapsulate dependencies
    this.collection = new OfferCollectionEntity()
  }

  // Get token data.

  // Calculate token price in USD

  // Add an offer to the collection. If the offer already exists, then return false.
  // Returns true if the offer was not already in the collection (is new).
  async addOffer (newOffer) {
    const zcid = newOffer.p2wdbHash
    if (!zcid) throw new Error('Offer data has no p2wdbHash property.')

    // Search the existing collection to see if the offer has already been processed.
    const result = this.collection.filter(x => x.p2wdbHash === zcid)

    // Exit if the offer already exists in the collection.
    if (result.length > 0) return false

    // Hydrate Offer with token and icon data
    const hydratedOffer = await this.hydrateOfferData(newOffer)

    // Generate an offer entity
    const offer = new OfferEntity(hydratedOffer)

    // Add the offer to the collection.
    this.collection.push(offer)

    return true
  }

  //
  async hydrateOfferData (newOffer) {

  }
}

// module.exports = OfferUseCases
export default OfferUseCases
