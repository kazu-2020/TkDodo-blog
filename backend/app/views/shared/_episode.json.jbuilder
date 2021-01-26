# frozen_string_literal: true

episode_data = fetch_episode_data(playlist_item: episode)
broadcast_events = fetch_broadcast_event(episode_data[:id])

if episode_data.present?
  json.type episode_data[:type]
  json.id episode_data[:id]
  json.name episode_data[:name]
  json.set_raw! :identifierGroup, episode_data[:identifierGroup].to_json
  json.set_raw! :identifierGroupEx, episode_data[:identifierGroupEx].to_json
  json.set_raw! :keywords, episode_data[:keywords].to_json
  json.description episode_data[:description]
  json.dateCreated episode_data[:dateCreated]
  json.dateModified episode_data[:dateModified]
  json.set_raw! :actors, episode_data[:actors].to_json
  if episode_data[:contributors].present?
    json.set_raw! :contributors, episode_data[:contributors].to_json
  else
    json.contributors []
  end
  json.set_raw! :partOfSeries, episode_data[:partOfSeries].to_json
  json.set_raw! :releasedEvent, episode_data[:releasedEvent].to_json
  json.set_raw! :detailedRecentEvent, episode_data[:detailedRecentEvent].to_json
  json.set_raw! :keyvisuals, episode_data[:keyvisuals].to_json
  json.set_raw! :eyecatch, episode_data[:eyecatch].to_json if episode_data[:eyecatch].present?
  json.set_raw! :eyecatches, episode_data[:eyecatches].to_json if episode_data[:eyecatches].present?
  json.set_raw! :videos, episode_data[:videos].to_json
  json.set_raw! :broadcastEvent, broadcast_events.to_json
  json.set_raw! :citations, episode_data[:citations].to_json
  json.url episode_data[:url]
  json.set_raw! :sameAs, episode_data[:sameAs].to_json
end
