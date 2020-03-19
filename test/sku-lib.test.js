var sku = require('../lib/js/sku-lib.js')
var chai = require('chai')

describe('Parse SKU test', function () {
  it('SKU parsing works', function () {
    const token="MDAyZWxvY2F0aW9uIHRlc3Qtc2t1LXN0b3JlLmJyYXZlc29mdHdhcmUuY29tCjAwMWVpZGVudGlmaWVyIEJyYXZlIFNLVSB2MS4wCjAwMzJjaWQgaWQgPSA5MTBlMmY1OS00YzNkLTRhN2UtOTU5Yi1mNzNkNjg4NjZkZGQKMDAxM2NpZCBhbW91bnQgPSA4CjAwMTdjaWQgY3VycmVuY3kgPSBCQVQKMDAyYWNpZCBkZXNjcmlwdGlvbiA9IDEyIG91bmNlcyBvZiBDb2ZmZWUKMDAxY2NpZCBleHBpcnkgPSAxNTg0NDkyNjM2CjAwMmZzaWduYXR1cmUgnSui4IyiWhl_usjCUeqZwMHs2Tn1X8VK6qHjyl7sNuoK"

    chai.expect(sku.parseSkuToken(token).bat).to.equal("8");
    chai.expect(sku.parseSkuToken(token).fiat).to.equal("1.80");
    chai.expect(sku.parseSkuToken(token).description).to.equal("12 ounces of Coffee");
  });
});

describe('BAT/USD conversion test', function () {
  it('BAT/USD conversion works', function () {
    chai.expect(sku.batToUSD(8)).to.equal("1.80");
    chai.expect(sku.fiatToBAT(2)).to.equal("8.88");
  });
});
