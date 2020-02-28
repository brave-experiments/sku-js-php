<?php

require __DIR__ . '/vendor/autoload.php';

use Macaroons\Utils;
use Macaroons\Macaroon;
use Macaroons\Packet;


class Controller {
     // This will be given to you from Brave
     const IDENTIFIER = "pk_Cxj0FUk0SmZGxFN";
     const SECRET = "sk_IOwQHMd7APmZtx1";

     public function invoke()
     {
          // Current website or variable representing the website
          $location = $_SERVER['HTTP_HOST'];

          // Represents the current item being rendered to purchase
          $id = "910e2f59-4c3d-4a7e-959b-f73d68866ddd";
          $amount = "1";
          $currency = "BAT";

          $m = new Macaroon(self::IDENTIFIER, self::SECRET, $location);

          $m->addFirstPartyCaveat('id = ' . $id);
          $m->addFirstPartyCaveat('amount = ' . $amount);
          $m->addFirstPartyCaveat('currency = ' . $currency);
          $m->addFirstPartyCaveat('description = ' . "12 ounces of coffee");
          $m->addFirstPartyCaveat('expiry = ' . strtotime("+5 minutes"));


          include 'View.php';
     }
}

?>
