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
    // TODO: cache people
    console.dir('showing congress data')
    
    congress.senior_senator.role = 'Senior Senator'
    congress.junior_senator.role = 'Junior Senator'
    congress.representative.role = 'Representative'
    
    makeFrontend(congress.senior_senator)
    makeFrontend(congress.junior_senator)
    makeFrontend(congress.representative)
    
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
      var latitude = position.coords.latitude
        , longitude = position.coords.longitude
      
      store.setItem('position', (latitude + ',' + longitude))
      return callback({
        latitude: latitude,
        longitude: longitude
      })
    })
  }
}

function makeFrontend(person) {
  // base.find('.fullname').text(person.fullname)
  // base.find('.party').text(person.bio.current_party)
  // base.find('.url').text(person.bio.url)
  // base.find('.twitter').text(person.bio.twitter)
  // base.find('.phone').text(person.phone)
  // base.find('.address').text(person.address)
  // base.find('.terms-served').text(person.bio.roles.length)
  person.party = person.bio.current_party
  
  congressElem.append(ich.congressperson(person))
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

