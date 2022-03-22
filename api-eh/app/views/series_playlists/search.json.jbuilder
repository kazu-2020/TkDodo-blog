json.result do
  json.array!(@result[:result][:tvseries][:result] || []) do |series|
    json.name series[:name]
    json.seriesId series[:id]
    json.set_raw! :eyecatch, series[:eyecatch].to_json
    json.set_raw! :logo, series[:logo].to_json
    json.set_raw! :hero, series[:hero].to_json
  end
end
json.nextUrl @result[:result][:tvseries][:nextUrl] if @result[:result][:tvseries][:nextUrl].present?
json.prevUrl @result[:result][:tvseries][:prevUrl] if @result[:result][:tvseries][:prevUrl].present?
json.count @result[:result][:tvseries][:count]
