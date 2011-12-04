class GMaps
  def GMaps.get_zip(lat, long)
    resp = HTTParty.get("http://maps.googleapis.com/maps/api/geocode/json?latlng=#{lat},#{long}&sensor=false")
    components = JSON.parse(resp.body)['results'][0]['address_components']
    components.last['long_name']
  end
end

    
