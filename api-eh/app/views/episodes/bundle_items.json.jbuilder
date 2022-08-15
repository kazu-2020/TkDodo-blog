# frozen_string_literal: true

if params[:playlist_id].blank?
  json.set_raw! :tvepisode, 0.to_json # 新規作成時には0を返す
else
  json.set_raw! :tvepisode, @result[:tvepisode_count].to_json
  json.set_raw! :event, @result[:event_count].to_json
  json.set_raw! :howto, @result[:howto_count].to_json
  json.set_raw! :faqpage, @result[:faqpage_count].to_json
end
