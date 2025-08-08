/*
  Unit tests for the nostr.js adapter library.
*/

import { assert } from 'chai'
import sinon from 'sinon'

import NostrAdapter from '../../../lib/adapters/nostr.js'
import mockDataLib from '../mocks/nostr-mock.js'

let uut

describe('#nostr.js', () => {
  let sandbox

  beforeEach(async () => {
    uut = new NostrAdapter({ nostrTopic: 'test' })
    uut.RelayPool = mockDataLib.RelayPoolMock

    // Restore the sandbox before each test.
    sandbox = sinon.createSandbox()
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should use provided relays if they are passed', () => {
      uut = new NostrAdapter({ nostrRelays: ['wss://nostr-relay.unit.info'], nostrTopic: 'test' })

      assert.equal(uut.relaysWs.length, 1)
      assert.equal(uut.relaysWs[0], 'wss://nostr-relay.unit.info')
    })

    it('should throw error if no topic is passed', async () => {
      try {
        uut = new NostrAdapter({ nostrRelays: ['wss://nostr-relay.psfoundation.info'] })

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, '"nostrTopic" must be passed when instantiate NostrAdapter')
      }
    })
    it('should use default relays if no relays are passed', () => {
      uut = new NostrAdapter({ nostrTopic: 'test' })

      assert.equal(uut.relaysWs, uut.defaultRelays)
    })
  })

  describe('#start', async () => {
    it('should start the adapter', async () => {
      const WIF = 'L1Lk9ymWeFVqWTvzhvd3yp3hSrgRrNyUZg8HcY3GG2fPawAA6pKG'
      const result = await uut.start(WIF)

      assert.equal(result, true)
    })

    it('should throw an error if no WIF is passed', async () => {
      try {
        await uut.start()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'WIF must be a string!')
      }
    })
  })

  describe('#post', async () => {
    it('should throw an error if no message is passed', async () => {
      try {
        await uut.post()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'msg must be a string!')
      }
    })
    it('should post a message to all relays', async () => {
      sandbox.stub(uut.bchNostr.post, 'uploadToNostr').resolves('eventId')

      const msg = 'Hello, world!'

      const result = await uut.post(msg)
      assert.isArray(result)
    })
    it('should handle error if one relay fails', async () => {
      sandbox.stub(uut.retryQueue, 'addToQueue')
        .onFirstCall().throws(new Error('test error'))
        .onSecondCall().resolves('eventId2')
        .onThirdCall().resolves('eventId3')

      const msg = 'Hello, world!'

      const result = await uut.post(msg)
      assert.isArray(result)
      assert.equal(result.length, 2)
      assert.equal(result[0], 'eventId2')
      assert.equal(result[1], 'eventId3')
    })
  })

  describe('#read', async () => {
    it('should read a message', async () => {
      const result = await uut.read()

      assert.isArray(result)
    })

    it('should throw an error if negative limit is passed', async () => {
      try {
        await uut.read(-1)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'Limit must be greater than 0')
      }
    })

    it('should throw an error if non-number limit is passed', async () => {
      try {
        await uut.read('10')

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'Limit must be greater than 0')
      }
    })
  })

  describe('#eventId2note', async () => {
    it('should convert an eventId to a note', async () => {
      const result = uut.eventId2note('2e4b14f5d54a4190c0101b87382db1ce5ef9ec5db39dc2265bac5bd9d91cded2')

      assert.isString(result)
    })
  })
})
