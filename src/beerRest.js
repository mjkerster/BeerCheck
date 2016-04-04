var beerRest = function(){
	'use strict';

	var httpClient = new XMLHttpRequest();

	var restFuncs = {
		getBeer: getBeer,
		httpPost: httpPost
	};

	return restFuncs;

	function getBeer(name, success, fail){
		var url = 'beer/'+name;

		httpClient.onreadystatechange = function(){
			if(httpClient.readyState === 4){
				if(httpClient.status === 200){
					success(httpClient.response);
				}
				else{
					fail(httpClient.status);	
				}
			}
		}
		httpClient.open('GET', url, true);
		httpClient.send();
	}

	function httpPost(url, obj){

	}
}();