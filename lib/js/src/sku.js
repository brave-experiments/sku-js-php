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
  button.setAttribute("style","font-family: 'Muli', Arial, Helvetica, sans-serif; height: 43px; background: #4c54d2; border-radius: 100px; padding: 0 15px; color: white; font-size: 13px;");
  strong.appendChild(buyText)
  button.appendChild(strong)

  var span = document.createElement('span')
  var dividerText = document.createTextNode('|')
  span.classList.add('divider')
  span.setAttribute("style","margin: 0 5px; opacity: 0.7;");
  span.appendChild(dividerText)
  button.appendChild(span)

  strong = document.createElement('strong')
  var usd = document.createTextNode('$' + valueInUSD)
  strong.appendChild(usd)
  button.appendChild(strong)

  var imgDiv = document.createElement('div')
  imgDiv.setAttribute("style","background: url('data:image/png;base64,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') no-repeat; display: inline-block; background-size: 16px 14px; width: 16px; height: 14px; margin: 0 3px; vertical-align: middle; ")
  button.appendChild(imgDiv)

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
