# frozen_string_literal: true

if @result[:result].instance_of?(Array) # シリーズまたはプレイリスト内のエピソードページング時にtrue
  json.items @result[:result]
  json.total @result[:count]
elsif @result.dig(:result, :tvepisode) # TVエピソード検索, ページング時にtrue
  json.items @result[:result][:tvepisode][:result]
  json.total @result[:result][:tvepisode][:count]
elsif @result.dig(:result, :tvseries)  # TVシリーズ検索, ページング時にtrue
  json.items @result[:result][:tvseries][:result]
  json.total @result[:result][:tvseries][:count]
else # プレイリスト検索, ページング時
  json.items @result.dig(:result, :nplaylist, :result)
  json.total @result.dig(:result, :nplaylist, :count)
end
