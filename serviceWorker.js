this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('beerCheckCacheV2').then(function(cache) {
      return cache.addAll([
        '/',  //ERROR 5 if this line isn't here than NON of the files will be able to be fetched.  I don't know why though...
        '/index.html',
        '/src/app.js',
        '/src/beerRest.js',
        '/src/styles/beerCheck.css',
        '/src/styles/pure-min.css',
        '/mybeer' //Positive because I use NODE.JS I can easily cache my data request
      ]);
    })
  );
});

this.addEventListener('fetch', function(event) {
  var urlToMatch = event.request.url.substring(event.request.url.length - 6);
  if(urlToMatch === 'mybeer'){
    event.respondWith(
      fetch(event.request).then(function(response){
        caches.open('beerCheckCacheV1').then(function(cache){
          cache.put(event.request, response);
        });
        return response.clone();
      },
      function(error){
        return error;
      })
    );
  }
  else{
    event.respondWith(
      caches.match(event.request).then(function(response){
        if(response)
          return response;

        return fetch(event.request).then(function(response){
          //console.log('RETURNING FETCHED RESPONSE')
          return response;
        });
      })
    );
  }
  
});

//ERROR 6 I had to use the then(success, fail) instead of the catch example provided in the documentation (See below)
// caches.match(event.request).catch(function() {
//   return fetch(event.request);
// })

