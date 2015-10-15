$.mockJSON.data.PRODUCTNAME = [
	'T-Shirt', 'Shirt', 'Trousers', 'JEANS', 'Shorts', 'Gloves', 'Tie'
];
$.mockJSON.data.LOREM_IPSUM = [
	'The trousers just very fun and cool', 'Mocked description'
];

$.mockjax({
	url: "/products",
	type: "GET",
	dataType: "json",
	responseTime: 750,
	status: 200,
	responseText: $.mockJSON.generateFromTemplate({
		'data|5-5': [{
			'id|1-100': 0,
			'name': '@PRODUCTNAME',
			'price|10-500': 0,
			'stock|1-9': 0
		}]
	})
});

$.mockjax({
	url: /^\/products\/([\d]+)$/,
	type: 'GET',
	dataType: 'json',
	responseTime: 750,
	responseText: $.mockJSON.generateFromTemplate({
		'data': {
			'id|1-100': 0,
			'name': '@PRODUCTNAME',
			'price|10-500': 0,
			'stock|1-9': 0,
			'description': '@LOREM_IPSUM'
		}
	})
});

$.mockjax({
	url: '/products',
	type: 'POST',
	dataType: 'json',
	responseTime: 750,
	status: 200,
	responseText: {
		'data': {
			text: 'Product created'
		}
	}
});

$.mockjax({
	url: /^\/products\/([\d]+)$/,
	type: 'PUT',
	dataType: 'json',
	responseTime: 750,
	status: 200,
	responseText: {
		'data': {
			text: 'Product saved'
		}
	}
});

$.mockjax({
	url: /^\/products\/([\d]+)$/,
	type: 'DELETE',
	dataType: 'json',
	responseTime: 750,
	status: 200,
	responseText: {
		'data': {
			text: 'Product deleted'
		}
	}
});