

bfe_model = {};
bfe_model.data = {};
bfe_model.find = {
	prev_category_type: '-0',
	category_type: '0',
	isonline: '*',
};
bfe_model.page = {
	page_size: 5,
	maxPageButton: 8,
	total: 0,
	current_page: 1
};
bfe_model.apis = {
	products: {
		get_products: '/photo-album/product/get_all_product?',
	},
	exit_product: {},
	category_mgr: {},
	promotion_category: {},
	image_center: {},
	carousel: {}
};
