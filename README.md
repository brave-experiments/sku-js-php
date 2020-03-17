# Reference implementation for SKUs

## Introduction

To integrate the Pay with BAT and SKU workflow on your site first sign-up on [publishers.brave.com](publishers.brave.com) to generate an identifier and secret associated with your site. Once you sign-up, integrate the JS and PHP libraries as described below in your code to use the Pay with BAT functionality.

## Prerequisites 

* Server with bare-metal PHP

## PHP library

You can install the php-library using composer:

```
composer require brave-experiments/sku-php
```

The PHP library consists of:

* **generateSKUToken()** -  You need to generate a SKU token for any item that is being displayed to the user. This function needs to be invoked on every page load for an item.


    Parameters:
    * **id**: String
    * **amount**: String
    * **currency**: String, should only be “BAT” for now. 
    * **description**: String
    * **expiry**: String in RFC3339 format

## JS Library

The JS library adds an onload handler which parses the SKU tokens embedded in the page with the `Buy With BAT` button. It can be used to implement these workflows:


* **One-click workflow**: Onload handler searches for `divs` with `bat-sku-one-click` and replaces each token with a button that invokes the Payment UI.


* **Add to Cart workflow**: Onload handler searches for `divs` with `bat-sku-item` and adds an onclick handler which adds and removes the item from the payment request. It also adds a `Buy with BAT` button to the div with `bat-sku-total` class. This button is updated to show the total whenever an item is added or removed from the cart.

## Workflow

1. Integrate sku libraries in your code.
2. Fetch the `SECRET` from the publisher dashboard.
2. Add the [`SECRET`](https://github.com/brave-experiments/sku-js-php/blob/master/demo_cart/Controller.php#L17) to your server side code. The secret should be stored securely. Do not include this directly in your server side code.
3. Generate sku tokens for each item. See sample code [here](https://github.com/brave-experiments/sku-js-php/blob/master/demo_cart/Controller.php#L25)
4. Embed the sku_token in your site. SKU tokens are parsed by the JS library to add a `Buy with BAT` button which on click invokes the Payment UI.
5. For:
    * **One-click workflow**: Embed the token with class name [bat-sku-one-click](https://github.com/brave-experiments/sku-js-php/blob/master/demo_one_click/View.php#L53). Once the JS library sees a `div` with this id. It parses the token to add a button which if clicked displays the Payment UI.
    * **Add-to-cart workflow**: Embed token for each item with [bat-sku-item](https://github.com/brave-experiments/sku-js-php/blob/master/demo_cart/View.php#L65). Once the JS library sees this class it adds an onclick handler which adds or removes the item from the cart. To show the total and display the Payment UI the code needs an additional `div` with class name [bat-sku-total](https://github.com/brave-experiments/sku-js-php/blob/master/demo_cart/View.php#L75) which adds a `Buy with BAT` button that updates the total dynamically as items are added/removed from the list. 

