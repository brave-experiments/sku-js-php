<?php
require __DIR__ . '/../../vendor/autoload.php';

use Macaroons\Utils;
use Macaroons\Macaroon;
use Macaroons\Packet;

function generateSKUToken($identifier, $secret, $id, $amount, $currency, $description, $expiry) {
  // Current website or variable representing the website
  $location = $_SERVER['HTTP_HOST'];

  $m = new Macaroon($identifier, $secret, $location);
  
  $m->addFirstPartyCaveat('id = ' . $id);
  $m->addFirstPartyCaveat('amount = ' . $amount);
  $m->addFirstPartyCaveat('currency = ' . $currency);
  $m->addFirstPartyCaveat('description = ' . $description);
  $m->addFirstPartyCaveat('expiry = ' . $expiry);

  return $m;
}

?>
