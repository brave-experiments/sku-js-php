<?php

require __DIR__ . '/vendor/autoload.php';
include 'lib/php/sku-lib.php';

use Macaroons\Utils;
use Macaroons\Macaroon;
use Macaroons\Packet;


class Controller {

     // This will be given to you from Brave
     const IDENTIFIER = "pk_Cxj0FUk0SmZGxFN";
     const SECRET = "sk_IOwQHMd7APmZtx1";

     public function invoke()
     {
	  $id = "910e2f59-4c3d-4a7e-959b-f73d68866ddd";
          $amount = "1";
	  $currency = "BAT";
	  $description = "12 ounces of Coffee";
	  $expiry = strtotime("+5 minutes");

	  $m = generateSKUToken(self::IDENTIFIER, self::SECRET, $id, $amount, $currency, $description, $expiry);
          include 'View.php';
     }
}

?>
