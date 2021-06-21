# frozen_string_literal: true

json.type faqpage[:type]
json.id faqpage[:id]
json.name faqpage[:name]
json.set_raw! :questions, faqpage[:questions].to_json
json.set_raw! :identifierGroup, faqpage[:identifierGroup].to_json
json.url faqpage[:url]
