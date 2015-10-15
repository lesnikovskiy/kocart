var vm = (function() {
	var loading = ko.observable(false);
	var debug = ko.observable(false);
	var catalog = ko.observableArray([
		Product(1, 'T-Shirt', 10.00, 22),
		Product(2, 'Trousers', 20.00, 10),
		Product(3, 'Shirt', 15.00, 20),
		Product(4, 'Shorts', 5.00, 10)
	]);
	var cart = ko.observableArray();
	var filteredCatalog = ko.observableArray(catalog());
	var searchTerm = ko.observable('');
	var visibleCatalog = ko.observable(true);
	var visibleCart = ko.observable(false);
	var showSearchBar = ko.observable(true);
	var selectedProduct = ko.observable();
	
	var filterCatalog = function() {
		if (!catalog()) {
			filteredCatalog([]);
		}	
		
		var filter = searchTerm().toLowerCase();
		if (!filter) {
			filteredCatalog(catalog());
		}
		
		var filtered = ko.utils.arrayFilter(catalog(), function(item) {
			var strProp = ko.unwrap(item['name']).toLocaleLowerCase();
			if (strProp && (strProp.indexOf(filter) !== -1)) {
				return true;
			}		
			return false;
		});
		
		filteredCatalog(filtered);
	};
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
		
	var newProduct = ko.observable(Product('', '', '', ''));
	var addProduct = function(data) {
		var id = new Date().valueOf();
		var product = new Product(id, data.name(), data.price(), data.stock());
		
		ProductResource.create(ko.toJS(data)).done(function(response) {
			catalog.push(product);
			filteredCatalog(catalog());
			newProduct(Product(new Date().valueOf(), '', 0, 0));
			$('#addToCatalogModal').modal('hide');
		});
	};
	var deleteProduct = function(product) {
		var tmpCart = cart();
		var i = tmpCart.length;
		var item;
		while (i--) {
			if (tmpCart[i].product.id() === product.id()) {
				item = tmpCart[i];
			}
		}
		removeFromCart(item);	
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
	var openEditModal = function(product) {
		var tmpProduct = ProductService.clone(product);
		selectedProduct(product);
		$('#editProductModal').modal('show');
	};
	var cancelEdition = function(product) {
		$('#editProductModal').modal('hide');	
	};
	var saveProduct = function(product) {
		ProductResource.save(ko.toJS(product)).done(function(response) {
			var tmpCatalog = catalog();
			var i = tmpCatalog.length;
			while (i--) {
				if (tmpCatalog[i].id() === product.id()) {
					ProductService.refresh(tmpCatalog[i], product);
				}
			}
			catalog(tmpCatalog);
			filterCatalog();
			$('#editProductModal').modal('hide');
		});
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
	var showDescription = function(data) {
		ProductResource.get(data.id()).done(function(response) {
			alert(response.data.description);
		});	
	};
	var allCallbackSuccess = function(response) {
		catalog([]);
		response.data.forEach(function(item) {
			catalog.push(Product(item.id, item.name, item.price, item.stock));
		});
		filterCatalog(catalog());
		ko.applyBindings(vm);
	};
	var activate = function() {
		ProductResource.all().done(allCallbackSuccess);
	};
	
 	return {
		loading: loading,
		debug: debug,
		searchTerm: searchTerm,
		catalog: filteredCatalog,
		filterCatalog: filterCatalog,
		cart: cart,
		cartHasProducts: cartHasProducts,
		showSearchBar: showSearchBar,
		totalItems: totalItems,
		grandTotal: grandTotal,		
		newProduct: newProduct,
		addProduct: addProduct,
		deleteProduct: deleteProduct,
		addToCart: addToCart,
		removeFromCart: removeFromCart,
		showOrder: showOrder,
		showCatalog: showCatalog,
		cancelEdition: cancelEdition,
		saveProduct: saveProduct,
		finishOrder: finishOrder,
		visibleCatalog: visibleCatalog,
		visibleCart: visibleCart,
		showDebug: showDebug,
		hideDebug: hideDebug,
		showDescription: showDescription,
		openEditModal: openEditModal,
		activate: activate
	};
})();

infuser.defaults.templateSuffix = ".html";
infuser.defaults.templateUrl = "views";

vm.activate();
