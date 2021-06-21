# frozen_string_literal: true

class SameAs < ApplicationRecord
  belongs_to :playlist

  validates :name, presence: true
  validates :url, presence: true, format: { with: URI::DEFAULT_PARSER.make_regexp }
end
