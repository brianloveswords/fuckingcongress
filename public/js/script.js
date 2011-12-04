/* Author: 

*/
var store = localStorage
  , geo = navigator.geolocation
  , geoLong = $('#long')
  , geoLat = $('#lat')
  , geoZipCode = $('#zipcode')

  , congressElem = $('#congress')
  , congressSeniorSenator = congressElem.find('.senior_senator')
  , congressJuniorSenator = congressElem.find('.junior_senator')
  , congressRepresantive = congressElem.find('.representative')

  , parties = { 'D' : 'Democrat', 'R': 'Republican', 'I': 'Independant' }

retrievePosition(function(pos) {
  geoLat.text(pos.latitude)
  geoLong.text(pos.longitude)

  getLegislators(pos, function(congress) {
    // TODO: cache people
    console.dir('showing congress data')
    console.dir(congress)
    
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
  var cachedPosition = store.getItem('position'), pos;
  if (cachedPosition) {
     console.dir('pulling from cache')
     pos = cachedPosition.split(',')
     return callback({
       latitude: pos[0],
       longitude: pos[1]
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
  person.initial = person.lastname[0]
  
  person.bio.terms_served = person.bio.roles.length
  person.bio.office_address = person.congress_office
  person.bio.on_committees = person.bio.roles[0].committees.length
  person.bio.committees = person.bio.roles[0].committees
  person.bio.full_party = parties[person.bio.current_party]
  congressElem.append(ich.congressperson(person))
  console.dir(person)
}

function getZip(pos, callback) {
  var url = ''
  url += '/zip'
  url += '?latitude=' + pos.latitude
  url += '&longitude=' + pos.longitude
  
  jQuery.get(url, function(data) {
    callback(data)
  }, 'json')
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

