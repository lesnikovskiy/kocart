var vm = (function() {
	var debug = ko.observable(false);
	var catalog = ko.observableArray([
		Product(1, 'T-Shirt', 10.00, 22),
		Product(2, 'Trousers', 20.00, 10),
		Product(3, 'Shirt', 15.00, 20),
		Product(4, 'Shorts', 5.00, 10)
	]);
	var cart = ko.observableArray();
	var searchTerm = ko.observable('');
	var visibleCatalog = ko.observable(true);
	var visibleCart = ko.observable(false);
	var showSearchBar = ko.observable(true);
	
	var filteredCatalog = ko.computed(function() {
		if (!catalog()) {
			return [];
		}
		
		var filter = searchTerm().toLowerCase();
		if (!filter) {
			return catalog();
		}
		
		var filtered = ko.utils.arrayFilter(catalog(), function(item) {
			var strProp = ko.unwrap(item['name']).toLocaleLowerCase();		
			return (strProp.indexOf(filter) > -1)
		});
		
		return filtered;
	});
	var cartHasProducts = ko.computed(function() {
		return (cart().length > 0)
	});
	var totalItems = ko.computed(function() {
		var tmpCart = cart();
		var total = 0;
		tmpCart.forEach(function(item) {
			total += parseInt(item.units(), 10);
		});
		return total;
	});
	var grandTotal = ko.computed(function() {
		var tmpCart = cart();
		var total = 0;
		tmpCart.forEach(function(item) {
			total += (item.units() * item.product.price());
		});
		return total;
	});
		
	var newProduct = Product('', '', '', '');	
	var clearNewProduct = function() {
		newProduct.name('');
		newProduct.price('');
		newProduct.stock('');
	};
	var addProduct = function(context) {
		var id = new Date().valueOf();
		var newProduct = Product(id, context.name(), context.price(), context.stock());
		catalog.push(newProduct);
		clearNewProduct();
	};
	var showOrder = function() {
		visibleCatalog(false);
	};
	var showCatalog = function() {
		visibleCatalog(true);
	};
	var addToCart = function(data) {
		var item = null;
		var tmpCart = cart();
		var n = tmpCart.length;
		while(n--) {
			if (tmpCart[n].product.id() === data.id()) {
				item = tmpCart[n];
			}
		}
		if (item) {
			item.addUnit();
		} else {
			item = CartProduct(data, 0);
			item.addUnit();
			tmpCart.push(item);
		}
		cart(tmpCart);
	};
	var removeFromCart = function(data) {
		var units = data.units();
		var stock = data.product.stock();
		data.product.stock(units+stock);
		cart.remove(data);
	};	
	var finishOrder = function() {
		cart([]);
		visibleCart(false);
		showCatalog();
		$('#finishOrderModal').modal('show');
	};
	var showDebug = function() {
		debug(true);	
	};
	var hideDebug = function() {
		debug(false);	
	};
	var allCallbackSuccess = function(response) {
		catalog([]);
		response.data.forEach(function(item) {
			catalog.push(Product(item.id, item.name, item.price, item.stock));
		});
		filteredCatalog(catalog());
		ko.applyBindings(vm);
	};
	var activate = function() {
		ProductResource.all().done(allCallbackSuccess);
	};
	
 	return {
		debug: debug,
		searchTerm: searchTerm,
		catalog: filteredCatalog,
		cart: cart,
		cartHasProducts: cartHasProducts,
		showSearchBar: showSearchBar,
		totalItems: totalItems,
		grandTotal: grandTotal,		
		newProduct: newProduct,
		addProduct: addProduct,
		addToCart: addToCart,
		removeFromCart: removeFromCart,
		showOrder: showOrder,
		showCatalog: showCatalog,
		finishOrder: finishOrder,
		visibleCatalog: visibleCatalog,
		visibleCart: visibleCart,
		showDebug: showDebug,
		hideDebug: hideDebug,
		activate: activate
	};
})();

infuser.defaults.templateSuffix = ".html";
infuser.defaults.templateUrl = "views";

vm.activate();
