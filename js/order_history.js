$(function(){
	console.log("aaaa");
	a_onclick();
})

function a_onclick(){
	setTimeout(function(){
		$(".panel-collapse").each(function(i,ielem){
			// console.log(ielem);
			// console.log($(ielem)[0].attributes[0].value);
			if($(ielem)[0].attributes[0].value == 'panel-collapse collapse in'){
				$("#span"+(i+1)).html("▲");
			}
			// console.log($(ielem)[0].attributes[2].value);
			if($(ielem)[0].attributes[2].value == 'false'){
				$("#span"+(i+1)).html("▼");
			}else{
				$("#span"+(i+1)).html("▲");
			}
		});
	},0);

}
