# Reference implementation for SKUs

## Introduction

This project allows merchants to integrate "Pay with BAT" on their website. The examples and documentation show the how SKU tokens are generated. These tokens allow for the browser and the Brave Payments library to understand what is being sold, the price, the description, and other properties related to the item. SKU tokens are platform-agnostic and can be used with any existing inventory or e-commerce platform.

## Prerequisites 

* Server with bare-metal PHP v7.4
* Composer: Composer is a dependency management tool for PHP. Installation instructions are [available here](https://getcomposer.org/doc/00-intro.md#installation-linux-unix-macos).

## PHP library

You can install the php-library using composer:

```
composer require brave-experiments/sku-php
```

You can read more about the wrappers available [here](https://github.com/brave-experiments/sku-php/blob/master/README.md)

## JS Library

The JS library adds an onload handler which parses the SKU tokens embedded in the page with the `Buy With BAT` button. It can be used to implement these workflows.

To integrate the JS library add this bundled [JS library](https://github.com/brave-experiments/sku-js-php/blob/master/lib/js/sku-lib.js) to your code.

## Using the reference implementation

1. Clone the repo
2. Copy `.env_example` in `demo_cart` and `demo_one_click` to `.env` 
3. Update the values for `SECRET` and `PAYMENT_HOST`. 
    * You can find the `SECRET` in your [publisher dashboard](publishers.brave.com) and set the `PAYMENT_HOST` to `grant.rewards.brave.software`.
4. Run `composer install` in `demo_cart` and `demo_one_click`. 
    * If you don't have privileges to run composer install in your hosting environment, you can run it locally and copy the `vendor/` folder to the corresponding directories your remote server.
 
 You're all set.

## Integration

1. Sign-up on [publishers.brave.com](publishers.brave.com) to generate a secret associated with your site.
2. Integrate PHP library in your [code](https://github.com/brave-experiments/sku-js-php#php-library).
3. Integrate JS library in your [code](https://github.com/brave-experiments/sku-js-php/blob/master/lib/js/sku-lib.js) and add the JS snippet to your [code](https://github.com/brave-experiments/sku-js-php/blob/master/demo_cart/View.php#L18)
4. Fetch the `SECRET` from the publisher dashboard. This secret should be stored securely (secret vaults or environment variables) and should not be directly included in the code. In the reference implementation, the secrets are stored as environment variables which are parsed by [`dotenv`](https://github.com/brave-experiments/sku-js-php/blob/master/demo_cart/.env_example). Rename the `.env_example` to `.env` for the reference implementation.
5. Set the `PAYMENT_HOST` to `grant.rewards.brave.software` in `.env`
6. Pass this [`SECRET`](https://github.com/brave-experiments/sku-js-php/blob/master/demo_cart/Controller.php#L23) to `generateSkuToken`.
7. Generate a `SKU_token` for each item. See sample code [here](https://github.com/brave-experiments/sku-js-php/blob/master/demo_cart/Controller.php#L31)
8. Embed the `SKU_token` in the web page. See sample code [here](https://github.com/brave-experiments/sku-js-php/blob/master/demo_cart/View.php#L56)
9. Invoke `BraveSKU.init()` on the client side after the page is loaded. See sample code [here](https://github.com/brave-experiments/sku-js-php/blob/master/demo_cart/js/init.js#L2). Init parses the SKU tokens to add a `Buy with BAT` button which on click invokes the Payment UI.
10. For:
    * **One-click workflow**: Embed the token with class name [bat-sku-one-click](https://github.com/brave-experiments/sku-js-php/blob/master/demo_one_click/View.php#L54). Once the JS library sees a `div` with this `class`. It parses the token to add a button which if clicked displays the Payment UI.

    * **Add-to-cart workflow**: Embed token for each item with [bat-sku-item](https://github.com/brave-experiments/sku-js-php/blob/master/demo_cart/View.php#L54). Once the JS library sees this class it adds an onclick handler which adds or removes the item from the cart. To show the total and display the Payment UI the code needs an additional `div` with id [bat-sku-total](https://github.com/brave-experiments/sku-js-php/blob/master/demo_cart/View.php#L73) which adds a `Buy with BAT` button that updates the total dynamically as items are added/removed from the list.
11. Once the `PaymentResponse` is received the `orderId` from the `PaymentResponse` is passed to [`validateOrderStatus`](https://github.com/brave-experiments/sku-js-php/blob/master/demo_cart/Controller.php#L37) to confirm if the Payment was successful.

## FAQ

 1. Do the SKU Tokens need to be generated on every page load?  
    SKU Tokens have an associated expiry time. If the SKU tokens are generated with a long expiry time, it is possible to re-use the tokens to purchase the item for an expired price.
