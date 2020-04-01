<?php

require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;
use Sku\Sku;

class Controller
{
    public function invoke()
    {
        $dotenv = Dotenv::createImmutable(__DIR__);
        $dotenv->load();

        $status = false;

        $sku = "BRAVE-12345";
        $amount = "8";
        $currency = "BAT";
        $description = "12 ounces of Coffee";
        $expiry = strtotime("+5 minutes");

        $m_12oz = Sku::generateSKUToken($_ENV['SKU_SECRET'], $sku, $amount, $currency, $description, $expiry);

        $sku = "BRAVE-54321";
        $amount = "10";
        $currency = "BAT";
        $description = "1 pound of Coffee";
        $expiry = date(DateTime::RFC3339, strtotime("+5 minutes"));

        $m_1lb = Sku::generateSKUToken($_ENV['SKU_SECRET'], $sku, $amount, $currency, $description, $expiry);
      
        $json = file_get_contents('php://input');
        $data = json_decode($json);
        if (!is_null($data)) {
            $host = isset($_ENV['PAYMENT_HOST']) ? $_ENV['PAYMENT_HOST'] : 'grant.rewards.brave.software';
            $response = Sku::validateOrderStatus($host, $data->{'details'}->{'orderId'});
            echo json_encode($response);
            return;
        }
        include 'View.php';
    }
}
?>
