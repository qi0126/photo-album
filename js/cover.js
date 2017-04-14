function createCover(){
	var html = '';
	html += '<div class="cover"></div>';
	html += '<div class="oncover"></div>';
	$('body').append(html);
}

function showCover(){
	$('body').css('overflow', 'hidden');
	$('.cover').show();
	$('.oncover').show();
}

function closeCover(){
	$('body').css('overflow', 'visible');
	$('.cover').hide();
	$('.oncover').hide();
}