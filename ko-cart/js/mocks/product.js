$.mockJSON.data.PRODUCTNAME = [
	'T-Shirt', 'Shirt', 'Trousers', 'JEANS', 'Shorts', 'Gloves', 'Tie'
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