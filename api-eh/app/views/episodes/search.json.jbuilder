# frozen_string_literal: true

key = @result[:result].keys

if key[0].to_s === 'tvepisode' then
  json.items @result[:result][:tvepisode][:result]
  json.total @result[:result][:tvepisode][:count]
else
  json.items @result[:result][:tvseries][:result]
  json.total @result[:result][:tvseries][:count]
end
