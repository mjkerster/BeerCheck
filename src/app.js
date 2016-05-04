var beerApp = function(){
	'use strict';

	var beerTools = {
		loadMyBeer: loadMyBeer,
		searchForBeer : searchForBeer,
		addBeer: addBeer,
		changeState: changeState
	};

	return beerTools;

	var searchedBeerList = {};
	var myBeerList = {};

	

	function loadMyBeer(){
		var el = document.getElementById('myBeerList');

		beerRest.getMyBeer(
			function success(response){
				var myObj = JSON.parse(response);
			 	myBeerList = myObj;
			 	domHelper.createList(el, myBeerList);
			},
			function fail(response){
				console.log('Request Failed: ')
			}
		);
	}



	function changeState(state){
		domHelper.pageState(state);
	}

	function searchForBeer(){
		event.preventDefault();
		var beer = document.getElementById('beerName').value;
		var el = document.getElementById('findList');

		domHelper.clearElementContents(el);
		beerRest.getBeer(beer, 
			function success(response){ 
			 	var myObj = JSON.parse(response);
			 	searchedBeerList = myObj.data;
			 	domHelper.createList(el, searchedBeerList);
			},
			function fail(response){
				searchedBeerList = {};
				console.log('Request Failed: '+ response);
			}
		);
	}

	function addBeer(index){
		beerRest.postBeer(searchedBeerList[index]);
		domHelper.pageState('main');
		searchedBeerList = {};
	}
	
}();

var domHelper = function(){
	'use strict';

	var domTools = {
		createList: createList,
		clearElementContents: clearElementContents,
		pageState: pageState
	};

	return domTools;

	function createList(el, listData){
		var template = '';
		var imageSrc;

		for(var i = 0; i < listData.length; i++){
			imageSrc = '';
			if(listData[i].hasOwnProperty('labels') && listData[i].labels.hasOwnProperty('icon')){
				imageSrc = listData[i].labels.icon;
			}

			template = '<li class="beer-row pure-u-1" onclick="beerApp.addBeer('+i+')"><div class="pure-u-1"><div class="beer-image pure-u-1-8"><img src="'+imageSrc+'"></div><div class="title-section pure-u-5-8"><span class="title pure-u-1">'+listData[i].nameDisplay+'</span><span class="pure-u-1 style">'+listData[i].style.name+' </span><span class="pure-u-1 abv">ABV: '+listData[i].abv+'%</span></div></div><div class="beer-description pure-u-1"><p>'+listData[i].description+'</p></div></li>'

			el.insertAdjacentHTML('beforeend', template);
		}
	}

	function clearElementContents(el){
		el.innerHTML = '';
	}

	function pageState(state){
		var mainEl = document.getElementById('main');
		var findEl = document.getElementById('find');
		if(state === 'main'){
			mainEl.removeAttribute('class', 'inactive');
			findEl.setAttribute('class', 'inactive');
		}
		else if(state === 'find'){
			findEl.removeAttribute('class', 'inactive');
			mainEl.setAttribute('class', 'inactive');
		}
	}

}();

var initializeServiceWorker = function(){


if ('serviceWorker' in navigator) {
	//ERROR 1: 404 when trying to pull file with path '/BeerCheck/src/<filename>'. I serve the files up differently with Node.js 
	//			It is set to serve everything at /
	//ERROR 2:  "Failed to register a ServiceWorker: An SSL certificate error occurred when fetching the script." If you are working locally
	//			you don't need to use HTTPS. Unless you have TLS certificate ready to go save yourself the time and just run it over HTTP.
	//ERROR 3:  You may notice a net::ERR_FILE_EXISTS error on the network tab of your Chrome console when loading your service work JS file
	//			This can be ignored, but if it bothers you, you can update your browser to 50 or higher
	//ERROR 4:  Max scope is at the root of the service worker JS file. Make sure all assests you want are at the root level or higher. *My 
	//			Index.html wasn't being cached cause the SW JS was in the src folder.
  navigator.serviceWorker.register('/serviceWorker.js', { scope: '/' }).then(function(reg) {
    if(reg.installing) {
      console.log('Service worker installing');
    } else if(reg.waiting) {
      console.log('Service worker installed');
    } else if(reg.active) {
      console.log('Service worker active');
    }
    
  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
};
}();