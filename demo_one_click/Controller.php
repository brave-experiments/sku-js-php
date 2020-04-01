<?php

require __DIR__ . '/vendor/autoload.php';

use Sku\Sku;

class Controller {

    public function invoke()
    {
        $sku = "BRAVE-12345";
        $amount = "8";
        $currency = "BAT";
        $description = "12 ounces of Coffee";
        $expiry = strtotime("+5 minutes");

        $m_12oz = Sku::generateSKUToken($_ENV['SKU_SECRET'], $sku, $amount, $currency, $description, $expiry);

        $sku = "BRAVE-12345";
        $amount = "10";
        $currency = "BAT";
        $description = "1 pound of Coffee";
        $expiry = date(DateTime::RFC3339, strtotime("+5 minutes"));

        $m_1lb = Sku::generateSKUToken($_ENV['SKU_SECRET'], $sku, $amount, $currency, $description, $expiry);

        include 'View.php';
    }
}

?>
