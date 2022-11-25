# frozen_string_literal: true

json.series_decks do
  json.array! @series_decks, partial: 'series_decks/series_deck', as: :series_deck
end

json.pagination do
  json.count @series_decks.count
  json.totalPages @series_decks.total_pages
  json.currentPage @series_decks.current_page
  json.nextPage @series_decks.next_page
  json.previousPage @series_decks.prev_page
end
