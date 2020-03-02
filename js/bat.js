function showPaymentUI(sku_token) {
  let supportedInstruments = [{
    supportedMethods: 'basic-card',
    data: {supportedNetworks: ['visa']},
  }, { 
    supportedMethods: 'bat',
  }];

  let details = {
    id: sku_token,
    total: {label: 'Total', amount: {currency: 'BAT', value: '2.00'}},
    displayItems: [
      {
        label: 'Ethiopia Bensa Bombe Coffee',
        amount: {currency: 'BAT', value: '45.00'},
      },
      {
        label: 'Brave discount',
        amount: {currency: 'BAT', value: '-43.00'},
      },
    ],
  };

  var request = new PaymentRequest(supportedInstruments, details);
  request.show().then(function(instrumentResponse) {
    console.log(instrumentResponse);
  })
  .catch(function(err) {
    console.log(err);
  });
}
