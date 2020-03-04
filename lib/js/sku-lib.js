const usdToBatConversionRate = 4.44;

let original_details = {
  id: '',
  total: {label: 'Total', amount: {currency: '', value: ''}},
  displayItems: [],
};

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

function usdToBAT(valueInUSD) {
  return (parseInt(valueInUSD) * usdToBatConversionRate).toFixed(2).toString();
}

function replaceTokenWithBATButtonOneClick(sku_token) {
  var sku_token = sku_token;
  var valueInUSD = "10";
  var valueInBAT = usdToBAT(valueInUSD);

  var button = getBATButton(valueInUSD, valueInBAT);
  button.onclick =  function () { buildPaymentRequestAndShowPaymentUI({}, sku_token, 'Coffee - Ethiopia Bensa Bombe', '45', 'BAT'); };
  return button;
}

function replaceSkuTotalWithBATButton() {
  var button = getBATButton();
  var details = addItemToPaymentRequest({}, 'sku_token', 'Coffee - Ethiopia Bensa Bombe', '45', 'BAT');
  details = addItemToPaymentRequest(details, 'discount_token', 'Brave Discount', '-43', 'BAT');
  
  button.onclick =  function () { showPaymentUI(details); };
  return button;
}

window.onload = function() {
  var i;
  var sku = document.getElementsByClassName('bat-sku-one-click');
  for (i = 0; i < sku.length; i++) {
    sku[i].appendChild(replaceTokenWithBATButtonOneClick(sku[i].name));
  }

  sku = document.getElementsByClassName('bat-sku-item');
  for (i = 0; i < sku.length; i++) {
    var sku_token = sku[i].name;
    sku[i].onclick = function () { addItemToPaymentRequest({}, sku_token, 'Coffee - Ethiopia Bensa Bombe', '45', 'BAT'); }; 
  }

  var total = document.getElementById('bat-sku-total');
  if (total) {
    total.appendChild(replaceSkuTotalWithBATButton());
  }
}

function addItemToPaymentRequest(details, sku_token, it_label, it_amount, it_currency) {
  if (Object.entries(details).length === 0) {
    details = original_details
    details.id = sku_token
    details.total.amount.value = it_amount
    details.total.amount.currency = it_currency
  } else {
    if (it_currency != details.total.amount.currency) {
      console.error('Currency Mismatch');
      return;
    }
    details.id += ";" + sku_token;
    amount = parseFloat(details.total.amount.value) + parseFloat(it_amount);
    details.total.amount.value = amount.toString();
  }
  
  item = {
    label: it_label,
    amount: {currency: it_currency, value: it_amount},
  }

  details.displayItems.push(item)
  console.log(details);
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

function buildPaymentRequestAndShowPaymentUI(details, sku_token, it_label, it_amount, it_currency){
   details = addItemToPaymentRequest(details, sku_token, it_label, it_amount, it_currency);
   details = addItemToPaymentRequest(details, 'discount_token', 'Brave Discount', '-43', 'BAT');
   showPaymentUI(details);
}
