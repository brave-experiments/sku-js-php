const macaroons = require('./macaroons.js')
const request = require('request') 
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

  var paymentRequest = new PaymentRequest(supportedInstruments, details)
  paymentRequest.show().then(function (instrumentResponse) {
    request({
      url: location.href,
      method: 'POST',
      json: true,
      headers: {
        "content-type": "application/json",
      },
      body: instrumentResponse
    }, function(error, response, body) {
      if (body.status) {
        document.getElementById('sku-payment-status').innerHTML = '<b>Status:</b> Successful';
      } else {
	document.getElementById('sku-payment-status').innerHTML = '<b>Status:</b> Failed';
	document.getElementById('sku-payment-message').innerHTML = '<b>Message:</b> ' + body.message;
      }
    });
  }).catch(function (err) {
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
