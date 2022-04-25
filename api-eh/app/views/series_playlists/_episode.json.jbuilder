json.type episode[:type]
json.id episode[:id]
json.name episode[:name]
json.set_raw! :identifierGroup, episode[:identifierGroup].to_json
json.set_raw! :identifierGroupEx, episode[:identifierGroupEx].to_json
json.set_raw! :keywords, episode[:keywords].to_json
json.description episode[:description]
json.dateCreated episode[:dateCreated]
json.dateModified episode[:dateModified]
json.set_raw! :actors, episode[:actors].to_json
if episode[:contributors].present?
  json.set_raw! :contributors, episode[:contributors].to_json
else
  json.contributors []
end
json.set_raw! :partOfSeries, episode[:partOfSeries].to_json
json.set_raw! :releasedEvent, episode[:releasedEvent].to_json
json.set_raw! :detailedRecentEvent, episode[:detailedRecentEvent].to_json
json.set_raw! :keyvisuals, episode[:keyvisuals].to_json
if episode[:eyecatch].present?
  json.set_raw! :eyecatch, episode[:eyecatch].to_json
elsif episode[:partOfSeries][:eyecatch].present?
  json.set_raw! :eyecatch, episode[:partOfSeries][:eyecatch].to_json
end
json.set_raw! :eyecatches, episode[:eyecatches].to_json if episode[:eyecatches].present?
json.set_raw! :videos, episode[:videos].to_json
json.set_raw! :broadcastEvent, episode[:broadcastEvent].to_json
json.set_raw! :citations, episode[:citations].to_json
json.url episode[:url]
json.set_raw! :sameAs, episode[:sameAs].to_json
