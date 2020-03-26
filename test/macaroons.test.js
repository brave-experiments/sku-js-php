var macaroons = require('../lib/js/src/macaroons.js')
var chai = require('chai')

describe('Parse v1 macaroon test', function () {
  it('Parsing V1 macaroons works', function () {
    const macaroon = 'MDAyZWxvY2F0aW9uIHRlc3Qtc2t1LXN0b3JlLmJyYXZlc29mdHdhcmUuY29tCjAwMWVpZGVudGlmaWVyIEJyYXZlIFNLVSB2MS4wCjAwMzJjaWQgaWQgPSA5MTBlMmY1OS00YzNkLTRhN2UtOTU5Yi1mNzNkNjg4NjZkZGQKMDAxM2NpZCBhbW91bnQgPSA4CjAwMTdjaWQgY3VycmVuY3kgPSBCQVQKMDAyYWNpZCBkZXNjcmlwdGlvbiA9IDEyIG91bmNlcyBvZiBDb2ZmZWUKMDAxY2NpZCBleHBpcnkgPSAxNTg0NDkyNjM2CjAwMmZzaWduYXR1cmUgnSui4IyiWhl_usjCUeqZwMHs2Tn1X8VK6qHjyl7sNuoK'

    const parsed = macaroons.parseV1Macaroon(macaroon)
    chai.expect(parsed.identifier).to.equal('Brave SKU v1.0')
    chai.expect(parsed.location).to.equal('test-sku-store.bravesoftware.com')
    chai.expect(Buffer.from(parsed.signature).toString('base64')).to.equal('77+9zKJaGW7isJR65rCwezZOfVfhkrrouLLnu43qgoA=')
    chai.expect(parsed.caveats.length).to.equal(5)
    chai.expect(parsed.caveats[0]).to.equal('id = 910e2f59-4c3d-4a7e-959b-f73d68866ddd')
    chai.expect(parsed.caveats[1]).to.equal('amount = 8')
    chai.expect(parsed.caveats[2]).to.equal('currency = BAT')
    chai.expect(parsed.caveats[3]).to.equal('description = 12 ounces of Coffee')
    chai.expect(parsed.caveats[4]).to.equal('expiry = 1584492636')
  })
})
