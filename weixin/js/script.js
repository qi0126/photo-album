

(function(k){
	var f=null,l=0,d=null,g=null,c=null,e=null,m=0,h=[],n=null,b=0,o=6E3,p=0,i="top",u=function(a){
		f=a.id;
		i=a.way&&a.way=="left"?"left":"top";
		n=f.find(".title a");
		g=f.find(".thumb");
		e=g.find("img");
		p=e.size();
		c=g.find(".now-status");
		d=f.find(".img li");
		o=a.interval;
		m=i=="left"?c.outerWidth():c.outerHeight();
		for(a=0;a<e.size();a++)
		if(a==0)
		h.push(0);
		else
		a>0&&h.push(a*m);
		q();
		t()
	},j=null,t=function(){
		e.hover(function(){
			c.stop();
			clearInterval(l);
			var a=e.index($(this));
			if(a!=b){
				j&&clearTimeout(j);
				j=setTimeout(function(){
					r(a)
				},100)
			}
		},function(){
			q()
		})
	},r=function(a){
		var s=h[a];
		i=="left"?c.animate({left:s}):c.animate({top:s});
		d.fadeOut();$(d[a]).fadeIn();
		n.text($(d[a]).find("img").attr("alt")).attr("href",$(d[a]).find("a").attr("href"));
		b=a
	},q=function(){
		l=window.setInterval(function(){
			b=b==p-1?-1:b;
			b+=1;
			r(b)
		},o)
	};
	k.slider||(k.slider={init:u});
	return slider
})(this);


//关闭app下载提示选项
function close_appdiv(){
  $("#appdiv").css('display','none');
}
