# frozen_string_literal: true

json.decks do
  json.array! @decks, partial: 'decks/deck', as: :deck
end

json.pagination do
  json.count @decks.count
  json.totalPages @decks.total_pages
  json.currentPage @decks.current_page
  json.nextPage @decks.next_page
  json.previousPage @decks.prev_page
  json.isFirstPage @decks.first_page?
  json.isLastPage @decks.last_page?
end
