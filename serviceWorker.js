this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('beerCheckCacheV3').then(function(cache) {
      return cache.addAll([
        '/',  //ERROR 5 if this line isn't here than NON of the files will be able to be fetched.  I don't know why though...
        '/index.html',
        '/src/app.js',
        '/src/beerRest.js',
        '/src/styles/beerCheck.css',
        '/src/styles/pure-min.css',
        '/src/styles/home.svg',
        '/src/styles/magnifier.svg',
        '/src/styles/beer.svg',
        '/mybeer' //Positive because I use NODE.JS I can easily cache my data request
      ]);
    })
  );
});

this.addEventListener('fetch', function(event) {
  console.log('METHOD: '+ event.request.method +' and URL: '+ event.request.url);

  if(event.request.method === 'POST'){
    event.respondWith(
      fetch(event.request).then(function(response){
        fetch('/mybeer').then(function(resp){
          caches.open('beerCheckCacheV5').then(function(cache){
            cache.put('/mybeer', resp);
          });
        });

        return response;
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

