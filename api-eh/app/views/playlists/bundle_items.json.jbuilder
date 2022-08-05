# frozen_string_literal: true

json.set_raw! :tvepisode, @result[:tvepisode_count].to_json
json.set_raw! :event, @result[:event_count].to_json
json.set_raw! :howto, @result[:howto_count].to_json
json.set_raw! :faqpage, @result[:faqpage_count].to_json
json.set_raw! :recipe, @result[:recipe_count].to_json
