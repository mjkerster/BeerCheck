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