# frozen_string_literal: true

class DeckSameAs < ApplicationRecord
  belongs_to :deck, optional: true

  validates :name, presence: true
  validates :url, presence: true, format: { with: URI::DEFAULT_PARSER.make_regexp }
end
