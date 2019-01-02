/**
 * Get the variable from the cookie
 * 
 * @param string varname without the 
 * @param {*} def Not sure what this is used for
 * 
 * @return mixed cookie value or null
 */
function leh_var(varname, def) {
  varname = 'leh_' + varname;
  if (Cookies.get(varname)) {
    return Cookies.get(varname);
  }
  if (typeof (def) !== "undefined") {
    return def;
  }
  return null;
}

/**
 * Set the cookie variable
 * 
 * @param string varname Variable Name
 * @param {*} value 
 * 
 * @return void
 */
function leh_set(varname, value) {
  varname = 'leh_' + varname;
  Cookies.set(varname, value.toLowerCase(), { expires: 30 });
}

/**
 * Gets the list of currencies
 * 
 * @return list of currencies
 */
function leh_get_currency_list() {
  return JSON.parse(decodeURIComponent(leh_var('currencies')));
}

/**
 * Validates the email address calling to the restfull api
 * 
 * @param {*} callback Calls callback function to return the JSON
 * 
 */
function leh_validate_email(email_address, callback) {
  leh_api_request('/address/validate/' + email_address, 'GET', callback);
}

/**
 * An ajax post to update the quantity
 * 
 * @param {*} select The dom element on change for the select list
 * @param {*} callback Calls callback function to return the JSON
 * 
 * @return void
 */
function leh_update_quantity(cart_ref, qty, callback) {
  leh_api_request('/cart/update/' + cart_ref + '/' + qty, 'POST', callback);
}

/**
 * Calls off to the ajax function to remove the cart item
 * 
 * @param {*} cart_ref 
 * @param {*} callback Calls callback function to return the JSON
 * 
 */
function leh_remove_product(cart_ref, callback) {
  leh_api_request('/cart/remove/' + cart_ref, 'DELETE', callback);
}

/**
 * An ajax post to add an item
 * 
 * @param {*} cart_ref The item reference for the cart
 * @param {*} qty      The Quantity to add
 * @param {*} callback Calls callback function to return the JSON
 * 
 * @return void
 */
function leh_add_to_cart(cart_ref, qty, callback) {
  leh_api_request('/cart/add/' + cart_ref + '/' + qty, 'POST', callback);
}

/**
 * Calls off to the ajax function to remove the cart item
 * 
 * @param {*} callback Calls callback function to return the JSON
 * 
 */
function leh_remove_coupon(callback) {
  leh_api_request('/cart/cpn/remove', 'DELETE', function() {
    leh_api_request('/cart', 'GET', callback);
  });
}

/**
 * Calls off to the ajax function to get the current cart json
 * 
 * @param {*} callback Calls callback function to return the JSON
 * 
 */
function leh_get_cart(callback) {
  leh_api_request('/cart', 'GET', callback);
}

/**
 * Calls off to the ajax function to do api operations
 * 
 * @param {*} params   Operation parameters to add to the request URL
 * @param {*} type     Request type
 * @param {*} callback Calls callback function to return the JSON
 * 
 */
function leh_api_request(params, type, callback) {
  jQuery.ajax({
    url: '/wp-json/wordplug/v1' + params,
    type: type,
    success: function (result) {
      callback(JSON.parse(result));
    },
    fail: function (result) {
      callback({fail:true, result:result});
    }
  });
}

