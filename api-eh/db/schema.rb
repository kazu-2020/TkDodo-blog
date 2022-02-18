# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2022_02_18_105200) do

  create_table "article_images", charset: "utf8mb4", force: :cascade do |t|
    t.integer "playlist_id", comment: "プレイリストID", unsigned: true
    t.text "image_data"
    t.string "image_id", comment: "Shrine が生成する画像ID"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["image_id"], name: "idx_image_id"
    t.index ["playlist_id"], name: "index_article_images_on_playlist_id"
  end

  create_table "citations", charset: "utf8mb4", force: :cascade do |t|
    t.integer "playlist_id", null: false
    t.string "name", null: false
    t.string "url", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "deck_playlists", charset: "utf8mb4", force: :cascade do |t|
    t.integer "deck_id", null: false, comment: "Deck ID"
    t.integer "playlist_id", null: false, comment: "Playlist ID"
    t.integer "position", default: 1, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["deck_id"], name: "index_deck_playlists_on_deck_id"
  end

  create_table "deck_same_as", charset: "utf8mb4", force: :cascade do |t|
    t.integer "deck_id", null: false
    t.string "name", null: false
    t.string "url", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["deck_id"], name: "index_deck_same_as_on_deck_id"
  end

  create_table "decks", charset: "utf8mb4", force: :cascade do |t|
    t.string "name"
    t.text "description", comment: "デッキの説明"
    t.string "deck_id", comment: "計測用の deckId"
    t.string "area"
    t.string "type_of_deck", default: "recommend", comment: "デッキを構成するプレイリストのタイプ"
    t.string "mode_of_item", default: "tv", comment: "デッキを構成するプレイリストのアイテムモード"
    t.string "type_of_item", default: "TVEpisode", comment: "デッキを構成するプレイリストのアイテムタイプ"
    t.boolean "is_r5", default: false, null: false, comment: "r5 相当のデッキか"
    t.string "interfix", comment: "deckId の中間接辞"
    t.string "deck_uid", comment: "デッキ uid"
    t.string "admin_memo", comment: "管理メモ"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "playlist_hashtags", charset: "utf8mb4", force: :cascade do |t|
    t.bigint "playlist_id", null: false
    t.text "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["playlist_id"], name: "index_playlist_hashtags_on_playlist_id"
  end

  create_table "playlist_items", charset: "utf8mb4", force: :cascade do |t|
    t.integer "playlist_id", null: false
    t.string "episode_id", null: false
    t.string "context", comment: "アイテムの種別(Type)"
    t.string "item_id", comment: "コンテキストに紐づくアイテムのID"
    t.integer "position", default: 1, null: false
    t.datetime "discarded_at", comment: "削除日時"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["discarded_at"], name: "index_playlist_items_on_discarded_at"
    t.index ["playlist_id"], name: "idx_playlist_id"
  end

  create_table "playlist_keywords", charset: "utf8mb4", force: :cascade do |t|
    t.bigint "playlist_id", null: false
    t.text "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["playlist_id"], name: "index_playlist_keywords_on_playlist_id"
  end

  create_table "playlists", charset: "utf8mb4", force: :cascade do |t|
    t.string "name"
    t.string "detailed_name_ruby", comment: "名前のルビ（ふりがな）"
    t.text "description", comment: "説明"
    t.text "headline", comment: "見出し"
    t.text "hero_image_data", comment: "ヒーローイメージ画像データ"
    t.text "eyecatch_image_data", comment: "アイキャッチ画像データ"
    t.text "logo_image_data", comment: "ロゴ画像データ"
    t.string "detailed_catch", comment: "キャッチコピー"
    t.string "format_genre_code", comment: "ジャンル（フォーマット）"
    t.string "theme_genre_code", comment: "ジャンル（テーマ）"
    t.string "selected_palette", comment: "指定カラー"
    t.string "primary_light_color", comment: "ライトモード主カラー"
    t.string "primary_dark_color", comment: "ダークモード主カラー"
    t.string "text_light_color", comment: "ライトモードテキストカラー"
    t.string "text_dark_color", comment: "ダークモードテキストカラー"
    t.string "link_light_color", comment: "ライトモードリンクカラー"
    t.string "link_dark_color", comment: "ダークモードリンクカラー"
    t.string "string_id", comment: "プレイリスト文字列ID（eh始まり)"
    t.string "string_uid", comment: "プレイリスト文字列ID（ハッシュ値）"
    t.integer "deck_id", comment: "デッキID"
    t.string "original_series_id", comment: "プレイリスト生成元のシリーズID"
    t.string "alias_id", comment: "短縮URL"
    t.string "d5_playlist_id", comment: "r5 デッキのプレイリストID"
    t.string "layout_pattern", default: "summary", null: false, comment: "レイアウトパターン"
    t.string "publish_level", default: "notyet", null: false, comment: "publish level"
    t.string "type_of_list", default: "recommend", null: false, comment: "typeOfList"
    t.string "mode_of_item", default: "tv", null: false, comment: "modeOfItem"
    t.text "marked_header", comment: "ヘッダー"
    t.text "article_body", size: :medium, comment: "記事本文"
    t.text "marked_body", size: :medium, comment: "記事本文（マークダウン）"
    t.text "marked_footer", comment: "フッター"
    t.json "editor_data", comment: "editorのjsonデータ"
    t.boolean "available_acticle", default: false, comment: "artilce が available かどうか"
    t.boolean "active_item_list", default: false, comment: "item_list の入力がアクティブかどうか"
    t.boolean "active_episode", default: true, comment: "episode の入力がアクティブかどうか"
    t.boolean "active_faq_page", default: false, comment: "faq_page の入力がアクティブかどうか"
    t.boolean "active_article", default: false, comment: "article の入力がアクティブかどうか"
    t.boolean "active_how_to", default: false, comment: "how_to の入力がアクティブかどうか"
    t.boolean "active_event", default: false, comment: "event の入力がアクティブかどうか"
    t.string "author_type", comment: "Person or Organization"
    t.string "author_name", comment: "著者名"
    t.string "publisher_type", comment: "Person or Organization"
    t.string "publisher_name", comment: "発行者名"
    t.integer "api_state", default: 0, null: false, comment: "APIの公開状態 close: 0, open: 1, waiting: 2"
    t.datetime "open_scheduled_at", comment: "予約公開日"
    t.datetime "close_scheduled_at", comment: "公開終了日時"
    t.datetime "published_at", comment: "公開日時"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["alias_id"], name: "index_playlists_on_alias_id", unique: true
    t.index ["string_uid"], name: "index_playlists_on_string_uid", unique: true
  end

  create_table "same_as", charset: "utf8mb4", force: :cascade do |t|
    t.integer "playlist_id", null: false
    t.string "name", null: false
    t.string "url", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["playlist_id"], name: "index_same_as_on_playlist_id"
  end

  add_foreign_key "playlist_hashtags", "playlists"
  add_foreign_key "playlist_keywords", "playlists"
end
