# frozen_string_literal: true

json.nplaylist do
  json.count 1
end

json.narticle do
  json.count @playlist.has_article? ? 1 : 0
end
