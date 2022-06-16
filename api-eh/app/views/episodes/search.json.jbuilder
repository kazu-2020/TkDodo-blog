# frozen_string_literal: true

if @result[:result].instance_of?(Array)
  json.items @result[:result]
  json.total @result[:count]
elsif @result.dig(:result, :tvepisode)
  json.items @result[:result][:tvepisode][:result]
  json.total @result[:result][:tvepisode][:count]
else
  @result.dig(:result, :tvseries)
  json.items @result[:result][:tvseries][:result]
  json.total @result[:result][:tvseries][:count]
end
