var sku = require('../lib/js/src/sku.js')
var chai = require('chai')

const token8 = 'MDAyZWxvY2F0aW9uIHRlc3Qtc2t1LXN0b3JlLmJyYXZlc29mdHdhcmUuY29tCjAwMWVpZGVudGlmaWVyIEJyYXZlIFNLVSB2MS4wCjAwMzJjaWQgaWQgPSA5MTBlMmY1OS00YzNkLTRhN2UtOTU5Yi1mNzNkNjg4NjZkZGQKMDAxM2NpZCBhbW91bnQgPSA4CjAwMTdjaWQgY3VycmVuY3kgPSBCQVQKMDAyYWNpZCBkZXNjcmlwdGlvbiA9IDEyIG91bmNlcyBvZiBDb2ZmZWUKMDAxY2NpZCBleHBpcnkgPSAxNTg1MjU0MjM4CjAwMmZzaWduYXR1cmUgnv1SXeI_Kgx148ufnp4gxkUPJZ41BNez_HGLmVTNfcIK'

const token12 = 'MDAyZWxvY2F0aW9uIHRlc3Qtc2t1LXN0b3JlLmJyYXZlc29mdHdhcmUuY29tCjAwMWVpZGVudGlmaWVyIEJyYXZlIFNLVSB2MS4wCjAwMzJjaWQgaWQgPSA1NmE2MTg5Zi0wNmUwLTQ3YjUtYWViYi0wZWIxN2MwMDkxMzAKMDAxNGNpZCBhbW91bnQgPSAxMAowMDE3Y2lkIGN1cnJlbmN5ID0gQkFUCjAwMjhjaWQgZGVzY3JpcHRpb24gPSAxIHBvdW5kIG9mIENvZmZlZQowMDJiY2lkIGV4cGlyeSA9IDIwMjAtMDMtMjZUMjA6MjM6NTgrMDA6MDAKMDAyZnNpZ25hdHVyZSDKKpkI1zFKZukShNHlsFtRppI725opZq-0ZBkQMWtXEAo'

describe('Parse SKU test', function () {
  it('SKU parsing works', function () {
    chai.expect(sku.parseSkuToken(token8).bat).to.equal('8')
    chai.expect(sku.parseSkuToken(token8).fiat).to.equal('1.80')
    chai.expect(sku.parseSkuToken(token8).description).to.equal('12 ounces of Coffee')
  })
})

describe('BAT/USD conversion test', function () {
  it('BAT/USD conversion works', function () {
    chai.expect(sku.batToUSD(8)).to.equal('1.80')
    chai.expect(sku.fiatToBAT(2)).to.equal('8.88')
  })
})

describe('Add/Remove Item to Payment Request', function () {
  it('Add/Remove Item to Payment Request', function () {
    var details = sku.addItemToPaymentRequest({}, sku.parseSkuToken(token8))
    chai.expect(details.id).to.equal(token8)
    chai.expect(details.total.amount.value).to.equal('8')
    chai.expect(details.displayItems.length).to.equal(1)
    chai.expect(details.displayItems[0].label).to.equal('12 ounces of Coffee')
    chai.expect(details.displayItems[0].amount.currency).to.equal('BAT')
    chai.expect(details.displayItems[0].amount.value).to.equal('8')

    details = sku.addItemToPaymentRequest(details, sku.parseSkuToken(token12))
    chai.expect(details.id).to.equal(token8 + ';' + token12)
    chai.expect(details.total.amount.value).to.equal('18')
    chai.expect(details.displayItems.length).to.equal(2)
    chai.expect(details.displayItems[1].label).to.equal('1 pound of Coffee')
    chai.expect(details.displayItems[1].amount.currency).to.equal('BAT')
    chai.expect(details.displayItems[1].amount.value).to.equal('10')

    sku.removeItemFromPaymentRequest(details, sku.parseSkuToken(token8))
    chai.expect(details.id).to.equal(token12)
    chai.expect(details.total.amount.value).to.equal('10.00')
    chai.expect(details.displayItems.length).to.equal(1)
    chai.expect(details.displayItems[0].label).to.equal('1 pound of Coffee')
    chai.expect(details.displayItems[0].amount.currency).to.equal('BAT')
    chai.expect(details.displayItems[0].amount.value).to.equal('10')
  })
})
