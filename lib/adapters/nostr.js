/*
  Adapter library for working with Nostr.

  TODO:
  - Refactor this library to use a pool of Nostr relays, rather than a single relay.
    - User should be able to define the array of relays.
    - Use these relays by default:
      - 'wss://nostr-relay.psfoundation.info',
      - 'wss://nos.lol',
      - 'wss://relay.damus.io'
*/

// Global npm libraries
import BchNostr from 'bch-nostr'
import { RelayPool } from 'nostr'
import RetryQueue from '@chris.troutner/retry-queue'
import * as nip19 from '@chris.troutner/nostr-tools/nip19'

class NostrAdapter {
  constructor (localConfig = { nostrRelays: [], nostrTopic: '' }) {
    this.defaultRelays = [
      'wss://nostr-relay.psfoundation.info',
      'wss://nos.lol',
      'wss://relay.damus.io'
    ]
    this.relaysWs = localConfig.nostrRelays

    this.topic = localConfig.nostrTopic

    // Use default Nostr relays if the user does not specify them.
    if (!this.relaysWs || this.relaysWs.length === 0) {
      console.log('No Array of relays provided, using default relays')
      this.relaysWs = this.defaultRelays
    }

    if (!this.topic) {
      throw new Error(
        '"nostrTopic" must be passed when instantiate NostrAdapter'
      )
    }

    // Encapsulate dependencies
    this.bchNostr = new BchNostr()
    this.RelayPool = RelayPool
    this.retryQueue = new RetryQueue({
      concurrency: 1,
      attempts: 5,
      retryPeriod: 1000
    })

    // Bind the 'this' object
    this.start = this.start.bind(this)
    this.post = this.post.bind(this)
    this.read = this.read.bind(this)
    this.eventId2note = this.eventId2note.bind(this)
  }

  // Create nostr keys.
  // NOTE:  WIF must be provided in this function instead the constructor function
  // we can provide it after app wallet creation.
  async start (WIF) {
    try {
      if (!WIF || typeof WIF !== 'string') {
        throw new Error('WIF must be a string!')
      }

      const { privKeyBuf, nostrPubKey } =
        this.bchNostr.keys.createNostrPubKeyFromWif({ wif: WIF })

      this.privKeyBuf = privKeyBuf
      this.nostrPubKey = nostrPubKey

      console.log(`Nostr Pub Key : ${nostrPubKey}`)

      return true
    } catch (error) {
      console.log(`Error in nostr.js/start() ${error.message} `)
      throw error
    }
  }

  // Post a message over the instance-topic.
  async post (msg = '') {
    try {
      if (!msg || typeof msg !== 'string') {
        throw new Error('msg must be a string!')
      }

      const inObj = {
        kind: 867,
        privKeyBuf: this.privKeyBuf,
        nostrPubKey: this.nostrPubKey,
        msg,
        tags: [['t', this.topic]]
      }
      const eventIds = []
      // Map All relays and try to post to each one.
      for (let i = 0; i < this.relaysWs.length; i++) {
        try {
          inObj.relayWs = this.relaysWs[i]
          const eventId = await this.retryQueue.addToQueue(this.bchNostr.post.uploadToNostr, inObj)
          eventIds.push(eventId)
        } catch (error) {
          continue
        }
      }

      return eventIds
    } catch (error) {
      console.log(`Error in nostr.js/post() ${error.message} `)
      throw error
    }
  }

  // Read a message over the instance-topic.
  async read (limit = 10) {
    try {
      if (typeof limit !== 'number' || limit < 1) {
        throw new Error('Limit must be greater than 0')
      }

      const relays = this.relaysWs
      const pool = this.RelayPool(relays)

      const nostrData = new Promise((resolve, reject) => {
        const messages = []

        pool.on('open', (relay) => {
          // relay.subscribe('REQ', { ids: [eventId] })
          relay.subscribe('REQ', { limit, kinds: [867], '#t': [this.topic] })
        })

        pool.on('eose', (relay) => {
          relay.close()
          resolve(messages)
        })

        pool.on('event', (relay, subId, ev) => {
          // console.log('ev: ', ev)
          messages.push({ content: ev.content, eventId: ev.id })
        })
      })

      const messages = await nostrData

      return messages
    } catch (error) {
      console.log(`Error in nostr.js/read() ${error.message} `)
      throw error
    }
  }

  // Convert an Event ID into a `noteabc..` syntax that Astral expects.
  // This can be used to generate a link to Astral to display the post.
  eventId2note (eventId) {
    return nip19.noteEncode(eventId)
  }
}

export default NostrAdapter
