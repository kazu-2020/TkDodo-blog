# frozen_string_literal: true

json.success 1
json.tvSeries @result[:tvseries]
json.tvEpisode @result[:tvepisode]&.first
json.set_raw! :recipes, recipes_json
json.set_raw! :howTos, howtos_json
json.set_raw! :events, event_json
