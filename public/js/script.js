/* Author: 

*/
var store = localStorage
  , geo = navigator.geolocation
  , geoDataElem = $('#geodata')
  , geoLong = geoDataElem.find('.long')
  , geoLat = geoDataElem.find('.lat')
  , geoZipCode = $('#zipcode')

  , congressElem = $('#congress')
  , congressSeniorSenator = congressElem.find('.senior_senator')
  , congressJuniorSenator = congressElem.find('.junior_senator')
  , congressRepresantive = congressElem.find('.representative')

retrievePosition(function(pos) {
  // geoLat.text(pos.latitude)
  // geoLong.text(pos.longitude)
  // geoDataElem.fadeIn()

  getLegislators(pos, function(congress) {
    getZip(pos, function(zip) {
      var geoinfo = ich.geoinfo({latitude: pos.latitude, longitude: pos.longitude, zipcode: zip })
      geoZipCode.text(zip)
      geoZipCode.attr('title', pos.latitude + ',' + pos.longitude)
    })

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
  person.initial = person.lastname[0]
  person.bio.terms_served = person.bio.roles.length
  person.bio.office_address = person.congress_office
  person.bio.on_committees = person.bio.roles[0].committees.length
  person.bio.committees = person.bio.roles[0].committees
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

