var beerRest = function(){
	'use strict';

	var httpClient = new XMLHttpRequest();

	var restFuncs = {
		getBeer: getBeer,
		getMyBeer: getMyBeer,
		postBeer: postBeer
	};

	return restFuncs;

	function getBeer(name, success, fail){
		var url = 'beer/'+name;

		_httpGetWrapper(url, success, fail);
	}

	function getMyBeer(success, fail){
		var url = 'mybeer';

		_httpGetWrapper(url, success, fail);
	}

	function postBeer(obj){
		httpClient.open("POST", "beer/add");
		httpClient.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		httpClient.send(JSON.stringify(obj));
	}

	function _httpGetWrapper(url, success, fail){
		
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
}();