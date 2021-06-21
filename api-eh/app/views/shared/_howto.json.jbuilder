# frozen_string_literal: true

json.type howto[:type]
json.id howto[:id]
json.name howto[:name]
json.description howto[:description]
json.tool howto[:tool]
json.supply howto[:supply]
json.totalTime howto[:totalTime]
json.estimatedCost howto[:estimatedCost]
json.set_raw! :section, howto[:section].to_json
json.set_raw! :identifierGroup, howto[:identifierGroup].to_json
json.dateCreated howto[:dateCreated]
json.dateModified howto[:dateModified]
json.url howto[:url]
