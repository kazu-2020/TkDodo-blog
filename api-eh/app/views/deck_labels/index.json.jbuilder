# frozen_string_literal: true

json.deckLabels do
  json.array! @deck_labels do |deck_label|
    json.id deck_label.id
    json.name deck_label.name
    json.displayName deck_label.display_name
  end
end
