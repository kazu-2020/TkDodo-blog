class AddApiStateToSeriesDecks < ActiveRecord::Migration[6.1]
  def change
    add_column :series_decks, :api_state, :integer, null: false, after: :interfix, comment: "APIの公開状態 close: 0, open: 1, waiting: 2"
  end
end
