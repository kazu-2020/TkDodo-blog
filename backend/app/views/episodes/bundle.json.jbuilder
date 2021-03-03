# frozen_string_literal: true

json.success 1
json.tvSeries @result[:tvseries]
json.tvEpisode @result[:tvepisode]&.first
json.set_raw! :recipes, (@result[:recipe] || []).to_json
json.set_raw! :howTos, (@result[:howto] || []).to_json
json.set_raw! :events, (@result[:event] || []).to_json
