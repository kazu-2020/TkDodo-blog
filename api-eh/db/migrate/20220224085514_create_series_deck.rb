class CreateSeriesDeck < ActiveRecord::Migration[6.1]
  def change
    create_table :series_decks do |t|
      t.string "name", null: false, comment: "デッキの名前"
      t.text "description", comment: "デッキの説明"
      t.string "string_id", null: false, unique: true, comment: "計測用のdeckId（series-tv-for-）"
      t.string "deck_uid", null: false, unique: true, comment: "デッキ uid"
      t.string "area"
      t.string "type_of_deck", null: false, default: "series", comment: "デッキを構成するプレイリストのタイプ"
      t.string "mode_of_item", null: false, default: "tv", comment: "デッキを構成するプレイリストのアイテムモード"
      t.string "type_of_item", null: false, default: "TVEpisode", comment: "デッキを構成するプレイリストのアイテムタイプ"
      t.string "interfix", null: false, comment: "deckId の中間接辞"
      t.string "admin_memo", comment: "管理メモ"

      t.timestamps
    end
  end
end
