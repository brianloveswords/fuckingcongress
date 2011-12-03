require 'sinatra'
require 'sunlight'
require 'json'

configure do
  set :port, 2900
end

Sunlight::Base.api_key = '0626f8cb863b472e921ec3459a03fb54'

def personToHash(person)
  { :firstname => person.firstname,
    :lastname => person.lastname,
    :fullname => "#{person.firstname} #{person.lastname}",
    :congress_office => person.congress_office,
    :phone => person.phone,
  }
end

get '/congress' do
  congress = Sunlight::Legislator.all_for(:latitude => params[:latitude], :longitude => params[:longitude])
  congressHash = {
    :senior_senator => personToHash(congress[:senior_senator]),
    :junior_senator => personToHash(congress[:junior_senator]),
    :representative => personToHash(congress[:representative]),
  }
  JSON.dump(congressHash)
end
