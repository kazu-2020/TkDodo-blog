# frozen_string_literal: true

json.decks do
  json.array! @decks, partial: 'decks/deck', as: :deck
end

json.partial! 'shared/pagination', record: @decks
