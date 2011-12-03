require 'uri'
require 'httparty'
require 'json'

class OpenTimes
  FORMAT = 'json'
  VERSION = 'v3'
  KEY = '53c38de17cf01cecec2658a0620c7219:3:62907679'
  
  class Congress
    BASE_URL = "http://api.nytimes.com/svc/politics/#{OpenTimes::VERSION}/us/legislative/congress"

    class Members
      URL_TEMPLATE = "#{OpenTimes::Congress::BASE_URL}/members/%s.#{OpenTimes::FORMAT}?api-key=#{OpenTimes::KEY}"
      
      BIOS = {}
      def Members.get_bio(member_id)
        if BIOS[member_id].nil?
          p "getting bio for #{member_id}"
          resp = HTTParty.get(self::URL_TEMPLATE % [member_id,])
          bio = JSON.parse(resp.body)['results'][0]
          BIOS[member_id] = bio
        else
          p "using memoized version of #{member_id}"
          BIOS[member_id]
        end
      end
    end
  end
end

# OpenTimes::Congress::Members.get_bio('S000148')
                         

