(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.BraveSKU = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const PACKET_PREFIX_LENGTH = 4

var Base64 = {
  _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

  encode: function (input) {
    var output = ''
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4
    var i = 0

    input = Base64._utf8_encode(input)

    while (i < input.length) {
      chr1 = input.charCodeAt(i++)
      chr2 = input.charCodeAt(i++)
      chr3 = input.charCodeAt(i++)

      enc1 = chr1 >> 2
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
      enc4 = chr3 & 63

      if (isNaN(chr2)) {
        enc3 = enc4 = 64
      } else if (isNaN(chr3)) {
        enc4 = 64
      }

      output =
        output +
        this._keyStr.charAt(enc1) +
        this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) +
        this._keyStr.charAt(enc4)
    }

    return output
  },

  decode: function (input) {
    var output = ''
    var chr1, chr2, chr3
    var enc1, enc2, enc3, enc4
    var i = 0

    input = input.replace(/[^A-Za-z0-9+/=]/g, '')

    while (i < input.length) {
      enc1 = this._keyStr.indexOf(input.charAt(i++))
      enc2 = this._keyStr.indexOf(input.charAt(i++))
      enc3 = this._keyStr.indexOf(input.charAt(i++))
      enc4 = this._keyStr.indexOf(input.charAt(i++))

      chr1 = (enc1 << 2) | (enc2 >> 4)
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
      chr3 = ((enc3 & 3) << 6) | enc4

      output = output + String.fromCharCode(chr1)

      if (enc3 !== 64) {
        output = output + String.fromCharCode(chr2)
      }
      if (enc4 !== 64) {
        output = output + String.fromCharCode(chr3)
      }
    }

    output = Base64._utf8_decode(output)

    return output
  },

  _utf8_encode: function (string) {
    string = string.replace(/\r\n/g, '\n')
    var utftext = ''

    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n)

      if (c < 128) {
        utftext += String.fromCharCode(c)
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192)
        utftext += String.fromCharCode((c & 63) | 128)
      } else {
        utftext += String.fromCharCode((c >> 12) | 224)
        utftext += String.fromCharCode(((c >> 6) & 63) | 128)
        utftext += String.fromCharCode((c & 63) | 128)
      }
    }

    return utftext
  },

  _utf8_decode: function (utftext) {
    var string = ''
    var i = 0
    var c, c1, c2

    while (i < utftext.length) {
      c = utftext.charCodeAt(i)

      if (c < 128) {
        string += String.fromCharCode(c)
        i++
      } else if (c > 191 && c < 224) {
        c1 = utftext.charCodeAt(i + 1)
        string += String.fromCharCode(((c & 31) << 6) | (c1 & 63))
        i += 2
      } else {
        c1 = utftext.charCodeAt(i + 1)
        c2 = utftext.charCodeAt(i + 2)
        string += String.fromCharCode(
          ((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63)
        )
        i += 3
      }
    }

    return string
  }
}

function depacketize (packet) {
  var key = packet.split(' ')[0]
  var value = packet.substring(key.length + 1)
  return [key, value]
}

function parseV1Macaroon (macaroon) { // eslint-disable-line no-unused-vars
  var index = 0
  var caveats = []
  var identifier
  var signature
  var location

  var decoded = Base64.decode(macaroon)

  while (index < decoded.length) {
    var length = parseInt(
      decoded.substring(index, index + PACKET_PREFIX_LENGTH),
      16
    )

    var stripped = decoded.substring(
      index + PACKET_PREFIX_LENGTH,
      index + length - 1
    )

    var [key, value] = depacketize(stripped)

    switch (key) {
      case 'location':
        location = value
        break
      case 'identifier':
        identifier = value
        break
      case 'cid':
        caveats.push(value)
        break
      case 'signature':
        signature = value
        break
    }

    index = index + length
  }

  return {
    identifier,
    signature,
    location,
    caveats
  }
}

module.exports = {
  parseV1Macaroon
}

},{}],2:[function(require,module,exports){
var macaroons = require('./macaroons.js')
const usdToBatConversionRate = 4.44

const originalDetails = {
  id: '',
  total: { label: 'Total', amount: { currency: 'BAT', value: '0' } },
  displayItems: []
}

var cartDetails = JSON.parse(JSON.stringify(originalDetails))

function getBATButton (valueInUSD, valueInBAT) {
  var button = document.createElement('button')
  var strong = document.createElement('strong')
  var buyText = document.createTextNode('Buy')
  strong.appendChild(buyText)
  button.appendChild(strong)

  var span = document.createElement('span')
  var dividerText = document.createTextNode('|')
  span.classList.add('divider')
  span.appendChild(dividerText)
  button.appendChild(span)

  strong = document.createElement('strong')
  var usd = document.createTextNode('$' + valueInUSD)
  strong.appendChild(usd)
  button.appendChild(strong)

  var img = document.createElement('img')
  img.src = '../img/bat.png'
  button.appendChild(img)

  span = document.createElement('span')
  var bat = document.createTextNode(valueInBAT + ' BAT')
  span.appendChild(bat)
  button.appendChild(span)

  return button
}

function fiatToBAT (valueInUSD) {
  return (parseInt(valueInUSD) * usdToBatConversionRate).toFixed(2).toString()
}

function batToUSD (valueInBAT) {
  return (parseInt(valueInBAT) / usdToBatConversionRate).toFixed(2).toString()
}

function parseSkuToken (token) {
  var skuDetails = macaroons.parseV1Macaroon(token)
  var amountCaveats = skuDetails.caveats.filter(caveat => caveat.includes('amount'))
  var currencyCaveats = skuDetails.caveats.filter(caveat => caveat.includes('currency'))
  var descriptionCaveats = skuDetails.caveats.filter(caveat => caveat.includes('description'))
  if (amountCaveats.length !== 1 || currencyCaveats.length !== 1 || descriptionCaveats.length !== 1) {
    console.error('Invalid macaroon')
    return
  }
  var currency = currencyCaveats[0].split('=')[1].trim()
  var amount = amountCaveats[0].split('=')[1].trim()
  var description = descriptionCaveats[0].split('=')[1].trim()
  if (currency === 'BAT') {
    return { token: token, fiat: batToUSD(amount), bat: amount, description: description }
  } else if (currency === 'USD') {
    return { token: token, fiat: amount, bat: fiatToBAT(amount), description: description }
  } else {
    console.error('Support for other currencies in progress!')
  }
}

function replaceTokenWithBATButtonOneClick (token) {
  var sku = parseSkuToken(token)
  var valueUSD = sku.fiat
  var valueBAT = sku.bat

  var button = getBATButton(valueUSD, valueBAT)
  button.onclick = function () { buildPaymentRequestAndShowPaymentUI({}, sku) }
  return button
}

function replaceSkuTotalWithBATButton () {
  var total = document.getElementById('bat-sku-total')
  if (total) {
    var button = getBATButton(batToUSD(cartDetails.total.amount.value), cartDetails.total.amount.value)
    total.innerHTML = ''
    button.onclick = function () { showPaymentUI(cartDetails) }
    total.appendChild(button)
  }
}

function init () {
  var i
  var sku = document.getElementsByClassName('bat-sku-one-click')
  for (i = 0; i < sku.length; i++) {
    sku[i].appendChild(replaceTokenWithBATButtonOneClick(sku[i].id))
  }

  sku = document.getElementsByClassName('bat-sku-item')
  for (i = 0; i < sku.length; i++) {
    sku[i].onclick = function () {
      var token = this.id
      var skuDetails = parseSkuToken(token)
      if (this.checked) {
        cartDetails = addItemToPaymentRequest(cartDetails, skuDetails)
      } else {
        removeItemFromPaymentRequest(cartDetails, skuDetails)
      }
      replaceSkuTotalWithBATButton()
    }
  }

  replaceSkuTotalWithBATButton()
}

function removeItemFromPaymentRequest (details, sku) {
  // remove sku_token
  var tokens = details.id.split(';')
  tokens = tokens.filter(e => e !== sku.token)
  details.id = tokens.join(';')

  // remove from total
  details.total.amount.value = (parseFloat(details.total.amount.value) - parseFloat(sku.bat)).toFixed(2).toString()

  // remove item from displayItems
  details.displayItems = details.displayItems.filter(e => e.label !== sku.description)
}

function addItemToPaymentRequest (details, sku) {
  if (!Object.prototype.hasOwnProperty.call(details, 'displayItems') || details.displayItems.length === 0) {
    details = JSON.parse(JSON.stringify(originalDetails))
    details.id = sku.token
    details.total.amount.value = sku.bat
    details.total.amount.currency = 'BAT'
  } else {
    if (details.total.amount.currency !== 'BAT') {
      console.error('Currency Mismatch')
      return
    }
    details.id = details.id + ';' + sku.token
    var amount = parseFloat(details.total.amount.value) + parseFloat(sku.bat)
    details.total.amount.value = amount.toString()
  }

  var item = {
    label: sku.description,
    amount: { currency: 'BAT', value: sku.bat }
  }

  details.displayItems.push(item)
  return details
}

function showPaymentUI (details) {
  // basic-card for debugging on Desktop
  const supportedInstruments = [{
    supportedMethods: 'basic-card',
    data: { supportedNetworks: ['visa'] }
  }, {
    supportedMethods: 'bat'
  }]

  var request = new PaymentRequest(supportedInstruments, details)
  request.show().then(function (instrumentResponse) {
    console.log(instrumentResponse)
  })
    .catch(function (err) {
      console.log(err)
    })
}

function buildPaymentRequestAndShowPaymentUI (details, sku) {
  details = addItemToPaymentRequest(details, sku)
  showPaymentUI(details)
}

module.exports = {
  init, parseSkuToken, fiatToBAT, batToUSD, addItemToPaymentRequest, removeItemFromPaymentRequest, originalDetails
}

},{"./macaroons.js":1}]},{},[2])(2)
});
