/*
  This library is used to download, cache, and manage token data, like the
  token's icon and other metadata. High level workflow:

  - A token ID and callback function are passed to this library.

  - All token data is cached in a key-value store using the token-ID as a key.
    If the token data is cached, the data is returned quickly and the callback
    function is executed.

  - If the token is not in the cache, the REST API request to download the token
    data is added to a retry queue.

  - After the token data is downloaded, the data is added to the cache, and the
    callback function is executed.

  TODO: Add retry-queue
*/

class TokenData {
  constructor (localConfig = {}) {
    // Dependency injection
    if (!localConfig.bchWallet) {
      throw new Error('Instance of minimal-slp-wallet must be passed as wallet property when instantiating TokenData library.')
    }
    this.bchWallet = localConfig.bchWallet

    // The token ID cache is an array of Token IDs that have been processed.
    // Each token ID in the array corresponds to a property in the
    // tokenDataCache object.
    this.tokenIdsCache = []

    // The token data cache contains data (like the token icon) about the
    // token. The object has a property that matches the token ID of the token.
    this.tokenDataCache = {}

    // Bind 'this' object to all subfunctions
    this.getTokenData = this.getTokenData.bind(this)
  }

  // This function expects an Offer object and a callback function as input.
  // The token media for the token ID in the Offer is retrieved. After the
  // data has been retrieved, the callback function is executed with the hydrated
  // Offer.
  // The function returns true after the callback function returns.
  async getTokenData (offer = {}, callbackFunc) {
    // Input validation
    if (!offer.tokenId) throw new Error('offer input object must contain a tokenId property when calling getTokenData()')
    if (!callbackFunc) throw new Error('callbackFunc required when calling getTokenData()')

    const tokenId = offer.tokenId

    // If the data is already in the cache, return that first.
    if (this.tokenIdsCache.includes(tokenId)) {
      offer.tokenData = this.tokenDataCache[tokenId]
      return offer
    }

    // Token ID does not exist in the cache.

    // Get token data for the given token.
    const tokenData = await this.bchWallet.getTokenData2(tokenId)

    // Add the data to the cache.
    this.tokenIdsCache.push(tokenId)
    this.tokenDataCache[tokenId] = tokenData

    // Add the data to the offer.
    offer.tokenData = tokenData

    callbackFunc(offer)

    return true
  }
}

export default TokenData
