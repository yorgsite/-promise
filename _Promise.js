

var _Promise=function(methods,init){
	var scope=this;
	var innerScope={};
	var build=function(){
		for(var i=0;i<methods.length;i++){
			new PPipe(methods[i]);
		}
		nextFrame(init.bind(innerScope));

	};
	var nextFrame=function(){
		return typeof(requestAnimationFrame)!=='undefined'?
			requestAnimationFrame:
			function(cb){setTimeout(cb,1);};
	}();
	var PPipe=function(name){
		var pipefunk	= function(){};
		var isout		= name.charAt(0)==="&";
		if(isout){
			name=name.substr(1);
			scope[name]=function(){
				var args=arguments;
				if(innerScope[name]){
					var result = innerScope[name].apply(innerScope,args);
					return typeof(result)==="undefined"?scope:result;
				}else{
					nextFrame(function(){
						if(innerScope[name]){
							innerScope[name].apply(innerScope,args);
						}
					});
					return scope;
				}
			};
		}else{
			scope[name]=function(response){
				if(typeof(response)=='function'){
					pipefunk=response;
				}
				return scope;
			};
			innerScope[name]=function(){
				var result = pipefunk.apply(null,arguments);
				return result;
			};
		}
	};
	build();
};


if( typeof exports !== 'undefined' ) {
	if( typeof module !== 'undefined' && module.exports ) {
		exports = module.exports = _Promise;
	}else{
		exports.mymodule = _Promise;
	}
}
