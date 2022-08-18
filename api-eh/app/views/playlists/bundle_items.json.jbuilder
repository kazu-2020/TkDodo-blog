# frozen_string_literal: true

json.set_raw! :tvepisodeCount, @result[:tvepisode_count].to_json
json.set_raw! :howToCount, @result[:howto_count].to_json
json.set_raw! :faqPageCount, @result[:faqpage_count].to_json
json.set_raw! :eventCount, @result[:event_count].to_json
json.set_raw! :recipeCount, @result[:recipe_count].to_json
