<h3> Generate a Macroon </h3>
<form action="" method="post">
<table>
<tr><td>Identifier:</td><td><input type="text" name="identifier" value="creator_identifier"></td></tr>
<tr><td>Secret:</td><td><input type="text" name="secret" value="secret"></td></tr>
<tr><td>URL:</td><td><input type="textt" name="url" value="example.com"></td></tr>
<tr><td>Id:</td><td><input type="text" name="id" value="5c846da1-83cd-4e15-98dd-8e147a56b6fa"></td></tr>
<tr><td>Amount:</td><td><input type="text" name="amount" value="23"></td></tr>
<tr><td>Currency:</td><td><input type="text" name="currency" value="BAT"></td></tr>
<tr><td>Description:</td><td><input type="text" name="description" value="Brave T-Shirt"></td></tr>
<tr><td>Price Expiry:</td><td><input type="text" name="expiry" value="2019-12-20T21:04:51.101Z"></td></tr>
<tr><td><input type="submit"></td></tr>
</table>
<br>
<h4>Macroon</h4>
<pre id="macroon"></pre>

</form>

<?php

require __DIR__ . '/vendor/autoload.php';

use Macaroons\Utils;
use Macaroons\Macaroon;
use Macaroons\Packet;


if (!$_POST) {
  return;
}

$identifier = $_POST['identifier'];
$secret = $_POST['secret'];
$location = $_POST['url'];

$id = $_POST['id'];
$amount = $_POST['amount'];
$currency = $_POST['currency'];
$description = $_POST['description'];
$expiry = $_POST['expiry'];

$m = new Macaroon($identifier, $secret, $location);

$m->addFirstPartyCaveat('id = ' . $id);
$m->addFirstPartyCaveat('amount = ' . $amount);
$m->addFirstPartyCaveat('currency = ' . $currency);
$m->addFirstPartyCaveat('description = ' . $description);
$m->addFirstPartyCaveat('expiry = ' . $expiry);


echo "<script>document.getElementById('macroon').innerHTML = '" . $m->serialize() . "'</script>";
?>
