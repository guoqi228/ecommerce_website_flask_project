//console.log("app.js");
var empty = `<li id="empty" class="dropdown-item inline list-group-item d-flex align-items-center flex-center"> Your cart is empty</li>`;
var check_out = `<li class="dropdown-item inline list-group-item d-flex align-items-center flex-center"><button id="checkout" type="button" class="btn btn-primary">Check out</button></li>`;
$("#cart").html(check_out);
$("#cart").prepend(empty);
$("#checkout").removeClass("btn-primary");
$("#checkout").addClass("btn-secondary");
$("#checkout").addClass("disabled");

//var string_data = document.getElementById("json-data").innerHTML;
var string_data = $("#json-data").html();
var string_data = string_data.replace(/'/g, '"');
var json_data = jQuery.parseJSON(string_data);

//var item_obj = {"items":[]};
function showItems() {
  var item = "";
  //var item_obj = {"items":[]};
  for (let i = 0; i < json_data.items.length; i ++) {
    var id = json_data.items[i].id;
    var name = json_data.items[i].name;
    var price = json_data.items[i].price;
    var description = json_data.items[i].description;
    //item_obj.items.push({"id":id, "name":name, "price":price, "quantity": 0});
    item += `<div id=${id} class="product-card"><div class="card"><div class="card-body"><img class="card-img-top" src="https://picsum.photos/g/150?random" alt="item img"><p>Here is some description of the item, here is some description of the item.</p><p class="p-normal">${name}<br>Price: ${price}</p><button id="btn-${id}" class="btn btn-primary add-item" type="button" onclick="addToCart(${id})">Add to cart</button></div></div></div></div></div>`;
  }
  //console.log(item_obj);
  $("#show-items").html(item);
}
$(document).ready(showItems)

function sum( obj ) {
  var sum = 0;
  for( var el in obj ) {
    if( obj.hasOwnProperty( el ) ) {
      sum += parseFloat( obj[el] );
    }
  }
  return sum;
}

var cart = {};
var item_in_cart = "";

function addToCart(id) {
  //console.log("ID:")
  //console.log(id);
  let index = id - 1;
  let item_name = json_data.items[index].name;
  let item_price = json_data.items[index].price;
  //item_obj.items[index].quantity += 1;
  //let item_quantity = item_obj.items[index].quantity;
  if (cart.hasOwnProperty(id)) {
    cart[`${id}`] += 1;
    //$(`#quantity-item-${id}`).text(`${cart[id]}`);
    //console.log(cart[`${id}`]);
    $(`#quantity-item-${id}`).text(cart[`${id}`]);
  } else {
    cart[`${id}`] = 1;
    item_in_cart = `<li id="cart-item-${id}" class="dropdown-item inline list-group-item d-flex justify-content-between align-items-center"><a>${item_name}------${item_price}</a><span id="plus-one-${id}" class="btn badge badge-pill badge-secondary font-weight-bold" onclick="addOne(${id})">+</span><span id="quantity-item-${id}" class="badge badge-primary badge-pill">${cart[`${id}`]}</span><span id="minus-one-${id}" class="btn badge badge-pill badge-secondary font-weight-bold" onclick="removeOne(${id})">-</span><button id="remove-btn-${id}" class="btn badge badge-pill badge-danger" type="button" onclick="removeFromCart(${id})">x</button></li>`;
    $("#cart").prepend(item_in_cart);
    //alert("Item added to shopping cart!");
    //showCart(item_in_cart);
  }
  let num_of_items = sum(cart);
  if (num_of_items > 0) {
    $("#checkout").addClass("btn-primary");
    $("#checkout").removeClass("btn-secondary");
    $("#checkout").removeClass("disabled");
    $("#empty").remove();
    $("#dropdownMenuButton").text(`Shopping cart (${num_of_items})`);
    let new_total = getTotal(cart);
    $("#checkout").text("Total: $" +`${new_total}`+"  "+ "Check out");
  }

  //console.log(item_in_cart);
}

function removeFromCart(id) {
  //console.log(`cart-item-${id}`);
  //$(`remove-btn-${id}`).preventDefault();
  //$(`#cart-item-${id}`).slideUp("slow");
  $(`#cart-item-${id}`).fadeOut(400, function(){ $(this).remove();});
  //$(`#cart-item-${id}`).remove();
  delete cart[`${id}`];
  let num_of_items = sum(cart);
  if (num_of_items > 0) {
    $("#empty").remove();
    $("#dropdownMenuButton").text(`Shopping cart (${num_of_items})`);
    let new_total = getTotal(cart);
    $("#checkout").text("Total: $" +`${new_total}`+"  "+ "Check out");
  } else {
    $("#empty").remove();
    $("#dropdownMenuButton").text(`Shopping cart`);
    $("#cart").fadeIn(400, function(){ $(this).prepend(empty);});
    $("#checkout").fadeIn(400, function(){ $(this).text(`Check out`).addClass("disabled").removeClass("btn-primary").addClass("btn-secondary");});
    //$("#checkout").removeClass("btn-primary");
    //$("#checkout").addClass("btn-secondary");
    //$("#checkout").addClass("disabled");
    //$("#checkout").text(`Check out`).addClass("disabled");
  }
}

function getTotal(cart) {
  let total = 0;
  for (key in cart) {
    if (cart.hasOwnProperty(key)) {
      //console.log("ID:"+ key + "value:" + cart[key]);
      let num = cart[key];
      //console.log("num: " + `${num}`);
      let index = key - 1;
      let price  =  json_data.items[index].price;
      let sub = num * price;
      total += sub
    }
  }
  return total.toFixed(2);
}

$('.keep-open').on({
    "shown.bs.dropdown": function() { $(this).attr('closable', false); },
    //"click":             function() { }, // For some reason a click() is sent when Bootstrap tries and fails hide.bs.dropdown
    "hide.bs.dropdown":  function() { return $(this).attr('closable') == 'true'; }
});

$('.keep-open').children().first().on({
  "click": function() {
    $(this).parent().attr('closable', true );
  }
});

function addOne(id) {
  //console.log(id)
  cart[`${id}`] += 1;
  $(`#quantity-item-${id}`).text(cart[`${id}`]);
  let num_of_items = sum(cart);
  $("#dropdownMenuButton").text(`Shopping cart (${num_of_items})`);
  let new_total = getTotal(cart);
  $("#checkout").text("Total: $" +`${new_total}`+"  "+ "Check out");
}

function removeOne(id) {
  //console.log(id)
  cart[`${id}`] -= 1;
  if (cart[`${id}`] == 0) {
    removeFromCart(id);
  } else {
    $(`#quantity-item-${id}`).text(cart[`${id}`]);
    let num_of_items = sum(cart);
    $("#dropdownMenuButton").text(`Shopping cart (${num_of_items})`);
    let new_total = getTotal(cart);
    $("#checkout").text("Total: $" +`${new_total}`+"  "+ "Check out");
  }
}
