# frozen_string_literal: true

json.nplaylist do
  json.count 1
end

if @playlist.deliver_article_via_api
  json.narticle do
    json.count @playlist.has_article? ? 1 : 0
  end
end
