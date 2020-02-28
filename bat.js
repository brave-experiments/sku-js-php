function buildPaymentRequest(sku_token) {
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
        label: 'Brave T-Shirt',
        amount: {currency: 'BAT', value: '65.00'},
      },
      {
        label: 'Brave discount',
        amount: {currency: 'BAT', value: '-63.00'},
      },
    ],
  };

  let request = new PaymentRequest(supportedInstruments, details);
  return request;
}
