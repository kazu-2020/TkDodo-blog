class CreateSeriesPlaylist < ActiveRecord::Migration[6.1]
  def change
    create_table :series_playlists do |t|
      t.string "string_id", null: false, unique: true, comment: "プレイリスト文字列ID（ts始まり)"
      t.string "series_id", null: false, unique: true, comment: "シリーズID"
      t.string "layout_pattern", default: "summary", null: false, comment: "レイアウトパターン"
      t.string "type_of_list", default: "series", null: false, comment: "typeOfList"
      t.string "mode_of_item", default: "tv", null: false, comment: "modeOfItem"
      t.text "marked_header", comment: "ヘッダー"
      t.text "article_body", size: :medium, comment: "記事本文"
      t.text "marked_body", size: :medium, comment: "記事本文（マークダウン）"
      t.text "marked_footer", comment: "フッター"
      t.json "editor_data", comment: "editorのjsonデータ"
      t.boolean "available_article", null: false, default: false, comment: "article が available かどうか"
      t.boolean "active_item_list", null: false, default: false, comment: "item_list の入力がアクティブかどうか"
      t.boolean "active_episode", null: false, default: true, comment: "episode の入力がアクティブかどうか"
      t.boolean "active_faq_page", null: false, default: false, comment: "faq_page の入力がアクティブかどうか"
      t.boolean "active_article", null: false, default: false, comment: "article の入力がアクティブかどうか"
      t.boolean "active_how_to", null: false, default: false, comment: "how_to の入力がアクティブかどうか"
      t.boolean "active_event", null: false, default: false, comment: "event の入力がアクティブかどうか"
      t.string "author_type", comment: "Person or Organization"
      t.string "author_name", comment: "著者名"
      t.string "publisher_type", comment: "Person or Organization"
      t.string "publisher_name", comment: "発行者名"
      t.integer "api_state", default: 0, null: false, comment: "APIの公開状態 close: 0, open: 1, waiting: 2"
      t.datetime "open_scheduled_at", comment: "予約公開日時"
      t.datetime "close_scheduled_at", comment: "公開終了日時"
      t.datetime "published_at", comment: "API公開日時"

      t.timestamps
    end
  end
end
