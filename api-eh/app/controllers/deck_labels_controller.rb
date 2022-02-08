# frozen_string_literal: true

class DeckLabelsController < ApplicationController
  def index
    @deck_labels = DeckLabel.all
  end
end
