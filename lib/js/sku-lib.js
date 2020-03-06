const usdToBatConversionRate = 4.44;

let original_details = {
  id: '',
  total: {label: 'Total', amount: {currency: 'BAT', value: '0'}},
  displayItems: [],
};

var cart_details = original_details;

function getBATButton(valueInUSD, valueInBAT) {
  var button = document.createElement("button");
  var strong = document.createElement("strong");
  var buyText = document.createTextNode("Buy");
  strong.appendChild(buyText);
  button.appendChild(strong);

  var span = document.createElement("span");
  var dividerText = document.createTextNode("|");
  span.classList.add('divider');
  span.appendChild(dividerText);
  button.appendChild(span);

  strong = document.createElement("strong");
  var valueInUSD = document.createTextNode("$" + valueInUSD);
  strong.appendChild(valueInUSD);
  button.appendChild(strong);

  var img = document.createElement("img");
  img.src = "../img/bat.png";
  button.appendChild(img);

  span = document.createElement("span");
  var valueInBAT = document.createTextNode(valueInBAT + " BAT");
  span.appendChild(valueInBAT);
  button.appendChild(span);
  
  return button;
}

function fiatToBAT(valueInUSD) {
  return (parseInt(valueInUSD) * usdToBatConversionRate).toFixed(2).toString();
}

function batToUSD(valueInBAT) {
  return (parseInt(valueInBAT) / usdToBatConversionRate).toFixed(2).toString();
}

function parseSkuToken(sku_token) {
  var sku_details = parseV1Macacroon(sku_token);
  var amount_caveats = sku_details.caveats.filter(caveat => caveat.includes("amount"))
  var currency_caveats = sku_details.caveats.filter(caveat => caveat.includes("currency"))
  var description_caveats = sku_details.caveats.filter(caveat => caveat.includes("description"))
  if (amount_caveats.length != 1 || currency_caveats.length != 1 || description_caveats.length != 1)  {
    console.error('Invalid macaroon');
    return;
  }
  var currency = currency_caveats[0].split("=")[1].trim()
  var amount = amount_caveats[0].split("=")[1].trim()
  var description = description_caveats[0].split("=")[1].trim()
  if (currency == 'BAT') {
    return {'token': sku_token, 'fiat': batToUSD(amount), 'bat': amount, 'description': description}
  } else if (currency == 'USD') {
    return {'token': sku_token, 'fiat': amount, 'bat': fiatToBAT(amount), 'description': description};
  } else {
    console.error('Support for other currencies in progress!');
    return;
  }
}

function replaceTokenWithBATButtonOneClick(sku_token) {
  var sku = parseSkuToken(sku_token);
  var value_USD = sku['fiat'];
  var value_BAT = sku['bat'];

  var button = getBATButton(value_USD, value_BAT);
  button.onclick =  function () { buildPaymentRequestAndShowPaymentUI({}, sku); };
  return button;
}

function replaceSkuTotalWithBATButton() {
  var total = document.getElementById('bat-sku-total');
  total.innerHTML = '';
  if (total) {
    var button = getBATButton(batToUSD(cart_details.total.amount.value), cart_details.total.amount.value);
    button.onclick =  function () { showPaymentUI(details); };
    total.appendChild(button);
  }
}

window.onload = function() {
  var i;
  var sku = document.getElementsByClassName('bat-sku-one-click');
  for (i = 0; i < sku.length; i++) {
    sku[i].appendChild(replaceTokenWithBATButtonOneClick(sku[i].id));
  }

  sku = document.getElementsByClassName('bat-sku-item');
  for (i = 0; i < sku.length; i++) {
    sku[i].onclick = function () {
      var sku_token = this.id;
      var sku_details = parseSkuToken(sku_token);
      if (this.checked) {
        addItemToPaymentRequest(cart_details, sku_details);
      } else {
	removeItemFromPaymentRequest(cart_details, sku_details);
      }
      replaceSkuTotalWithBATButton();
    };
  }

  replaceSkuTotalWithBATButton();
}

function removeItemFromPaymentRequest(details, sku) {
  //remove sku_token
  var sku_tokens = details.id.split(';');
  sku_tokens = sku_tokens.filter(e => e !== sku.token);
  details.id = sku_tokens.join(';');

  //remove from total
  details.total.amount.value = (parseFloat(details.total.amount.value) - parseFloat(sku.bat)).toFixed(2).toString();
   
  //remove item from displayItems
  details.displayItems = details.displayItems.filter(e => e.label !== sku.description);
}

function addItemToPaymentRequest(details, sku) {
  if (Object.entries(details.displayItems).length === 0) {
    details = original_details
    details.id = sku.token
    details.total.amount.value = sku.bat
    details.total.amount.currency = 'BAT'
  } else {
    if ('BAT' != details.total.amount.currency) {
      console.error('Currency Mismatch');
      return;
    }
    details.id = details.id + ";" + sku.token;
    amount = parseFloat(details.total.amount.value) + parseFloat(sku.bat);
    details.total.amount.value = amount.toString();
  }
  
  item = {
    label: sku.description,
    amount: {currency: 'BAT', value: sku.bat},
  }

  details.displayItems.push(item)
  return details;
}

function showPaymentUI(details) {
  // basic-card for debugging on Desktop
  let supportedInstruments = [{
    supportedMethods: 'basic-card',
    data: {supportedNetworks: ['visa']},
  }, { 
    supportedMethods: 'bat',
  }];

  var request = new PaymentRequest(supportedInstruments, details);
  request.show().then(function(instrumentResponse) {
    console.log(instrumentResponse);
  })
  .catch(function(err) {
    console.log(err);
  });
}

function buildPaymentRequestAndShowPaymentUI(details, sku){
   details = addItemToPaymentRequest(details, sku);
   showPaymentUI(details);
}
