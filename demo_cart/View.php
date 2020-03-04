<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>A simple storefront</title>

    <link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
      integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
      crossorigin="anonymous"
    />
    <link rel="stylesheet" href="./../css/index.css" />
    <script src="../lib/js/sku-lib.js"></script>
  </head>

  <body>
    <nav>
      <a href="#">Shop</a>
    </nav>

    <main>
      <!-- Here's the beginning of an item on the store-->
      <div class="bg-white rounded shadow mt-4 p-4">
        <header>Coffee - Ethiopia Bensa Bombe</header>
        <!-- Simple image and description -->

        <div class="flex">
          <div>
            <img
              width="200"
              src="https://cdn.shopify.com/s/files/1/1707/3261/products/1d838fd48bd8df474e48ad3ed6fc6b1a-Ethiopia_20Bombe_20Kenya-Washed_20Bag_20Pic_800x.png?v=1580973722"
            />
          </div>

          <div>
            <strong>Description</strong>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
              blandit pellentesque metus, at molestie diam porttitor eleifend.
              Aenean posuere fringilla nulla ac tincidunt. Aenean at ipsum eu
              est laoreet luctus eget ac risus. Pellentesque non lacus quis
              lorem semper interdum. Sed vel fringilla ante. Ut rutrum
              condimentum ornare. Morbi bibendum felis tellus, et efficitur
              justo venenatis vitae. Vivamus in nunc eu orci porta molestie sed
              auctor odio. Curabitur sollicitudin auctor ligula, non scelerisque
              ipsum convallis quis. Nulla facilisi. Sed a lectus nec justo
              malesuada egestas nec in diam. Praesent porttitor volutpat magna.
              Aliquam at gravida lectus, at lacinia libero.
            </p>

            <!-- Some options you could display to the users -->
            <strong>Sizes</strong>

            <div class="sizes">
              <div>
                <input class="bat-sku-item" type="checkbox" name="<?php echo $m_12oz->serialize() ?>;10" id="pound" />
		<label for="12">12 ounces</label>
              </div>

              <div>
                <input class="bat-sku-item" type="checkbox" name="<?php echo $m_1lb->serialize() ?>; 15" id="pound" />
                <label for="pound">1 pound</label>
	      </div>

              <div id='bat-sku-total'></div>

            </div>
          </div>
        </div>
      </div>
    </main>
  </body>
</html>
