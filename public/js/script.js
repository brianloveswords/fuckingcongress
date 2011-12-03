/* Author: 

*/
var store = localStorage
  , geo = navigator.geolocation
  , geoDataElem = $('#geodata')
  , geoLong = geoDataElem.find('.long')
  , geoLat = geoDataElem.find('.lat')

  , congressElem = $('#congress')
  , congressSeniorSenator = congressElem.find('.senior_senator')
  , congressJuniorSenator = congressElem.find('.junior_senator')
  , congressRepresantive = congressElem.find('.representative')

retrievePosition(function(pos) {
  geoLat.text(pos.latitude)
  geoLong.text(pos.longitude)
  geoDataElem.fadeIn()

  getLegislators(pos, function(congress) {
    console.dir('showing congress data')
    congressSeniorSenator.text('Your senior senator is ' + congress.senior_senator.fullname)
    congressJuniorSenator.text('Your junior senator is ' + congress.junior_senator.fullname)
    congressRepresantive.text('Your representative is ' + congress.representative.fullname)
    
    congressElem.fadeIn()
  })
})

function retrievePosition(callback) {
  var cachedPosition = store.getItem('position').split(',')
  if (cachedPosition) {
     console.dir('pulling from cache')
     return callback({
       latitude: cachedPosition[0],
       longitude: cachedPosition[1]
     })
  }
  else {
    console.dir('getting geodata')
    geo.getCurrentPosition(function(position) {
      var la = position.coords.latitude
        , lo = position.coords.longitude
      
      store.setItem('position', (la + ',' + lo))
      return callback({
        latitude: la,
        longitude: lo
      })
    })
  }
}

function getLegislators(pos, callback) {
  var url = ''
  url += '/congress'
  url += '?latitude=' + pos.latitude
  url += '&longitude=' + pos.longitude
  
  jQuery.get(url, function(data) {
    callback(data)
  }, 'json')
}

