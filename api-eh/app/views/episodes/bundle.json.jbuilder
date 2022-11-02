# frozen_string_literal: true

json.success true
json.tvSeries @result[:tvepisode]&.[](:result)&.[](0)&.[](:partOfSeries)
json.tvEpisode @result[:tvepisode]&.[](:result)&.[](0)
json.set_raw! :recipes, (@result[:recipe]&.[](:result) || []).to_json
json.set_raw! :howTos, (@result[:howto]&.[](:result) || []).to_json
json.set_raw! :events, (@result[:event]&.[](:result) || []).to_json
json.set_raw! :faqpage, (@result[:faqpage]&.[](:result) || []).to_json
