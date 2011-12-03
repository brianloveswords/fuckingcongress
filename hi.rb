require 'sinatra'
require 'sunlight'
require 'json'

require "nyt.rb"

configure do
  set :port, 2900
end

Sunlight::Base.api_key = '0626f8cb863b472e921ec3459a03fb54'

CONGRESS_MEMO = {}

def getCongress(latitude, longitude)
  coords = "#{latitude},#{longitude}"
  congress = Sunlight::Legislator.all_for(:latitude => latitude, :longitude => longitude)
  return {
    :senior_senator => personToHash(congress[:senior_senator]),
    :junior_senator => personToHash(congress[:junior_senator]),
    :representative => personToHash(congress[:representative]),
  }
end


def personToHash(person)
  { :bioguide_id => person.bioguide_id,
    :firstname => person.firstname,
    :lastname => person.lastname,
    :fullname => "#{person.firstname} #{person.lastname}",
    :congress_office => person.congress_office,
    :phone => person.phone,
    :bio => OpenTimes::Congress::Members.get_bio(person.bioguide_id)
  }
end

get '/congress' do
  latitude = params[:latitude]
  longitude = params[:longitude]
  
  coords = "#{latitude},#{longitude}"
  if CONGRESS_MEMO[coords].nil?
    p "memoizing?!"
    congress = getCongress(latitude, longitude)
  else
    p "using memo"
    congress = CONGRESS_MEMO[coords]
  end
  
  JSON.dump(congress)
end

get '/member' do
  member = OpenTimes::Congress::Members.get_bio(params[:bioguide_id])
  JSON.dump(member)
end
