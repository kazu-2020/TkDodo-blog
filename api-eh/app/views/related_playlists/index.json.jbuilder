# frozen_string_literal: true

json.playlists @related_playlists do |playlist|
  json.stringId playlist[:id]
  json.name playlist[:name]
  json.url playlist[:url]
  json.set_raw! :logo, playlist[:logo].to_json
  json.set_raw! :identifierGroup, playlist[:identifierGroup].to_json
end
