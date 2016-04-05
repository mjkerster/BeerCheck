var beerApp = function(){
	'use strict';

	var beerTools = {
		searchForBeer : searchForBeer
	};

	return beerTools;

	function searchForBeer(){
		event.preventDefault();
		var beer = document.getElementById('beerName').value;
		var el = document.getElementById('findList');

		domHelper.clearElementContents(el);
		beerRest.getBeer(beer, 
			function success(response){ 
			 	var myObj = JSON.parse(response);
			 	domHelper.createList(el, myObj.data);
			},
			function fail(response){
				console.log('This is my fail: '+ response);
			}
		);
	}
	
}();

var domHelper = function(){
	'use strict';

	var domTools = {
		createList: createList,
		clearElementContents: clearElementContents
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
			//template = '<div><img src="'+imageSrc+'">'+listData[i].nameDisplay+'</div>';><span>ABV: '+listData[i].abv+'%</span><span>'+listData[i].style.name+'</span></div><div class="beer-description pure-u-1">'+listData[i].description+'</div></div></li>';
			
			template = '<li class="beer-row pure-u-1"><div class="pure-u-1"><div class="beer-image pure-u-1-8"><img src="'+imageSrc+'"></div><div class="title-section pure-u-5-8"><span class="title pure-u-1">'+listData[i].nameDisplay+'</span><span class="pure-u-1 style">'+listData[i].style.name+' </span><span class="pure-u-1 abv">ABV: '+listData[i].abv+'%</span></div></div><div class="beer-description pure-u-1"><p>'+listData[i].description+'</p></div></li>'

			el.insertAdjacentHTML('beforeend', template);
		}
	}

	function clearElementContents(el){
		el.innerHTML = '';
	}

}();