var ProductResource = (function() {
	function all() {
		return $.ajax({
			dataType: "json",
			type: "GET",
			url: "/products"
		});
	}
	function get(id) {
		return $.ajax({
			dataType: "json",
			type: "GET",
			url: "/products/" + id
		});
	}
	function create(product) {
		return $.ajax({
			dataType: "json",
			type: "POST",
			url: "/products",
			data: product
		});
	}
	function update(product) {
		return $.ajax({
			dataType: "json",
			type: "PUT",
			url: "/products/" + product.id,
			data: product
		});
	}
	function remove(id) {
		return $.ajax({
			dataType: "json",
			type: "DELETE",
			url: "/products/" + id
		});
	}
	
	return {
		all: all,
		get: get,
		create: create,
		update: update,
		remove: remove
	};
})();