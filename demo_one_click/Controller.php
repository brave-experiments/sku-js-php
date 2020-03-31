<?php

require __DIR__ . '/vendor/autoload.php';

use Sku\Sku;
use Dotenv\Dotenv;

class Controller
{
    public function invoke()
    {
        $dotenv = Dotenv::createImmutable(__DIR__);
        $dotenv->load();

        $status = false;

        $id = "910e2f59-4c3d-4a7e-959b-f73d68866ddd";
        $amount = "1";
        $currency = "BAT";
        $description = "12 ounces of Coffee";
        $expiry = strtotime("+5 minutes");

        $m_12oz = Sku::generateSKUToken($_ENV['SKU_SECRET'], $id, $amount, $currency, $description, $expiry);

        $id = "56a6189f-06e0-47b5-aebb-0eb17c009130";
        $amount = "10";
        $currency = "BAT";
        $description = "1 pound of Coffee";
        $expiry = date(DateTime::RFC3339, strtotime("+5 minutes"));

        $m_1lb = Sku::generateSKUToken($_ENV['SKU_SECRET'], $id, $amount, $currency, $description, $expiry);

        $json = file_get_contents('php://input');
        $data = json_decode($json);
        if (!is_null($data)) {
            $status = Sku::validateOrderStatus($data->{'objectId'});
            $response = [
              'status' => $status,
            ];
            echo json_encode($response);
            return;
        }

        include 'View.php';
    }
}

?>
