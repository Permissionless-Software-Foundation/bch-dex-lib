/*
  PLACEHOLDER

  Offer Entity

  The Entity concept comes from Clean Architecture
  https://christroutner.github.io/trouts-blog/blog/clean-architecture

  An Offer has the following major facets:
  - Offer Data
  - Token Data
  - Icon
*/

class OfferEntity {
  constructor (offerData) {
    this.offerData = offerData

    // This will be replaced by data from the psf-slp-indexer.
    this.tokenData = {}

    // This object contains state for controlling the download of the token icon.
    this.icon = {
      iconDownloaded: false,
      iconUrl: null
    }
  }
}

export default OfferEntity
