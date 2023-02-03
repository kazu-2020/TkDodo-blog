# frozen_string_literal: true

json.series_decks do
  json.array! @series_decks, partial: 'series_decks/series_deck', as: :series_deck
end

json.partial! 'shared/pagination', record: @series_decks
