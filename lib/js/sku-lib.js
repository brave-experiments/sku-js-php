let original_details = {
  id: '',
  total: {label: 'Total', amount: {currency: '', value: ''}},
  displayItems: [],
};

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
