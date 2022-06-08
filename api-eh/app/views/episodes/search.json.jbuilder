# frozen_string_literal: true

if @result.dig(:result).instance_of?(Array) then
  json.items @result[:result]
  json.total @result[:count]
else
  if @result.dig(:result, :tvepisode)
    json.items @result[:result][:tvepisode][:result]
    json.total @result[:result][:tvepisode][:count]
  else @result.dig(:result, :tvseries)
    json.items @result[:result][:tvseries][:result]
    json.total @result[:result][:tvseries][:count]
  end
end
