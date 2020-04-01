var macaroons = require('../lib/js/src/macaroons.js')
var chai = require('chai')

describe('Parse v1 macaroon test', function () {
  it('Parsing V1 macaroons works', function () {
    const macaroon = 'MDAyZWxvY2F0aW9uIHRlc3Qtc2t1LXN0b3JlLmJyYXZlc29mdHdhcmUuY29tCjAwMWVpZGVudGlmaWVyIEJyYXZlIFNLVSB2MS4wCjAwMWFjaWQgc2t1ID0gQlJBVkUtMTIzNDUKMDAxM2NpZCBhbW91bnQgPSA4CjAwMTdjaWQgY3VycmVuY3kgPSBCQVQKMDAyYWNpZCBkZXNjcmlwdGlvbiA9IDEyIG91bmNlcyBvZiBDb2ZmZWUKMDAxY2NpZCBleHBpcnkgPSAxNTg1NzcyMTI5CjAwMmZzaWduYXR1cmUgv1YLWwYDXb3Iwj5BnJ_azL-RU9xIL3Hqy-nAJac8efsK'

    const parsed = macaroons.parseV1Macaroon(macaroon)
    chai.expect(parsed.identifier).to.equal('Brave SKU v1.0')
    chai.expect(parsed.location).to.equal('test-sku-store.bravesoftware.com')
    chai.expect(Buffer.from(parsed.signature).toString('base64')).to.equal('75aLWwYDXe2Igj5B7JazLRU9xILnnqzngJbssafsqIAA')
    chai.expect(parsed.caveats.length).to.equal(5)
    chai.expect(parsed.caveats[0]).to.equal('sku = BRAVE-12345')
    chai.expect(parsed.caveats[1]).to.equal('amount = 8')
    chai.expect(parsed.caveats[2]).to.equal('currency = BAT')
    chai.expect(parsed.caveats[3]).to.equal('description = 12 ounces of Coffee')
    chai.expect(parsed.caveats[4]).to.equal('expiry = 1585772129')
  })
})
