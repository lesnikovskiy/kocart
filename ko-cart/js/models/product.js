/*** Use here Revealing Module Pattern https://carldanley.com/js-revealing-module-pattern/ ***/
var Product = function(id,name,price,stock) {
	"use strict";
	var
		_id = ko.observable(id),
		_name = ko.observable(name),
		_price = ko.observable(price),
		_stock = ko.observable(stock)
	;
	var _hasStock = ko.computed(function() {
		return (_stock() < 5);
	})
	
	var decreaseStock = function(num) {
		var stock = _stock() - num;
		_stock(stock <= 0 ? 0 : stock);	
	};
	
	return {
		id: _id,
		name: _name,
		price: _price,
		stock: _stock,
		hasStock: _hasStock,
		decreaseStock: decreaseStock
	};
};