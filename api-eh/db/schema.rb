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

ActiveRecord::Schema[7.0].define(version: 2022_07_20_015813) do
  create_table "article_images", charset: "utf8mb4", force: :cascade do |t|
    t.bigint "playlist_id", comment: "プレイリストID"
    t.text "image_data"
    t.string "image_id", comment: "Shrine が生成する画像ID"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["image_id"], name: "idx_image_id"
    t.index ["playlist_id"], name: "index_article_images_on_playlist_id"
  end

  create_table "citations", charset: "utf8mb4", force: :cascade do |t|
    t.bigint "playlist_id", null: false
    t.string "name", null: false
    t.string "url", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["playlist_id"], name: "fk_rails_a162149268"
  end

  create_table "deck_playlists", charset: "utf8mb4", force: :cascade do |t|
    t.bigint "deck_id", null: false, comment: "Deck ID"
    t.bigint "playlist_id", null: false, comment: "Playlist ID"
    t.integer "position", default: 1, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["deck_id", "playlist_id"], name: "index_deck_playlists_on_deck_id_and_playlist_id", unique: true
    t.index ["deck_id"], name: "index_deck_playlists_on_deck_id"
    t.index ["playlist_id"], name: "fk_rails_32de3978a5"
  end

  create_table "deck_same_as", charset: "utf8mb4", force: :cascade do |t|
    t.bigint "deck_id", null: false
    t.string "name", null: false
    t.string "url", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
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
    t.string "interfix", comment: "deckId の中間接辞"
    t.string "deck_uid", comment: "デッキ uid"
    t.string "admin_memo", comment: "管理メモ"
    t.integer "api_state", default: 0, null: false, comment: "APIの公開状態 close: 0, open: 1, waiting: 2"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "person_organization_globals", charset: "utf8mb4", force: :cascade do |t|
    t.string "uuid", null: false
    t.string "viaf_id"
    t.string "viaf_name", comment: "キャッシュ用"
    t.string "wikidata_id"
    t.string "wikidata_name", comment: "キャッシュ用"
    t.string "wikidata_occupation", comment: "キャッシュ用 wikidata の occupation(P106) をもとに生成する"
    t.string "wikidata_image_url", comment: "キャッシュ用"
    t.text "wikidata_description", comment: "キャッシュ用 wikidata の descriptions をもとに生成する"
    t.integer "wikidata_alias", limit: 1, default: 0, comment: "0: false 1: true"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["uuid"], name: "index_person_organization_globals_on_uuid", unique: true
    t.index ["viaf_id"], name: "index_person_organization_globals_on_viaf_id", unique: true
    t.index ["wikidata_id"], name: "index_person_organization_globals_on_wikidata_id", unique: true
  end

  create_table "person_organization_locals", charset: "utf8mb4", force: :cascade do |t|
    t.string "uuid"
    t.string "role", null: false, comment: "Person: 個人 Organization: 組織"
    t.string "name", null: false
    t.text "occupation"
    t.text "description"
    t.integer "name_format", null: false
    t.string "family_name"
    t.string "given_name"
    t.string "additional_name"
    t.string "name_ruby"
    t.string "family_name_ruby"
    t.string "given_name_ruby"
    t.json "image_data", comment: "表示用。外部公開はしない。Shrineのフォーマット"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["uuid"], name: "index_person_organization_locals_on_uuid", unique: true
  end

  create_table "playlist_hashtags", charset: "utf8mb4", force: :cascade do |t|
    t.bigint "playlist_id", null: false
    t.text "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["playlist_id"], name: "index_playlist_hashtags_on_playlist_id"
  end

  create_table "playlist_items", charset: "utf8mb4", force: :cascade do |t|
    t.bigint "playlist_id", null: false
    t.string "episode_id", null: false
    t.string "context", comment: "アイテムの種別(Type)"
    t.string "item_id", comment: "コンテキストに紐づくアイテムのID"
    t.integer "position", default: 1, null: false
    t.datetime "discarded_at", precision: nil, comment: "削除日時"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["discarded_at"], name: "index_playlist_items_on_discarded_at"
    t.index ["playlist_id"], name: "idx_playlist_id"
  end

  create_table "playlist_keywords", charset: "utf8mb4", force: :cascade do |t|
    t.bigint "playlist_id", null: false
    t.text "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["playlist_id"], name: "index_playlist_keywords_on_playlist_id"
  end

  create_table "playlists", charset: "utf8mb4", force: :cascade do |t|
    t.string "name"
    t.string "detailed_name_ruby", comment: "名前のルビ（ふりがな）"
    t.text "description", comment: "説明"
    t.string "headline", comment: "見出し"
    t.text "hero_image_data", null: false, comment: "ヒーローイメージ画像データ"
    t.text "eyecatch_image_data", null: false, comment: "アイキャッチ画像データ"
    t.text "logo_image_data", null: false, comment: "ロゴ画像データ"
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
    t.string "alias_id", comment: "短縮URL"
    t.string "layout_pattern", default: "summary", null: false, comment: "レイアウトパターン"
    t.string "publish_level", default: "full", null: false, comment: "publish level"
    t.string "type_of_list", default: "recommend", null: false, comment: "typeOfList"
    t.string "mode_of_item", default: "tv", null: false, comment: "modeOfItem"
    t.text "marked_header", comment: "ヘッダー"
    t.text "article_body", size: :medium, comment: "記事本文"
    t.text "marked_body", size: :medium, comment: "記事本文（マークダウン）"
    t.text "marked_footer", comment: "フッター"
    t.json "editor_data", comment: "editorのjsonデータ"
    t.boolean "available_article", default: false, comment: "article が available かどうか"
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
    t.datetime "open_scheduled_at", precision: nil, comment: "予約公開日"
    t.datetime "close_scheduled_at", precision: nil, comment: "公開終了日時"
    t.datetime "published_at", precision: nil, comment: "公開日時"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["alias_id"], name: "index_playlists_on_alias_id", unique: true
    t.index ["string_uid"], name: "index_playlists_on_string_uid", unique: true
  end

  create_table "same_as", charset: "utf8mb4", force: :cascade do |t|
    t.bigint "playlist_id", null: false
    t.string "name", null: false
    t.string "url", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["playlist_id"], name: "index_same_as_on_playlist_id"
  end

  create_table "search_persons_organizations", charset: "utf8mb4", force: :cascade do |t|
    t.string "uuid"
    t.text "names", null: false, comment: "wikidataのラベル・エイリアスとviafの名前とlocalの名前をマージした情報を検索用テキストとして保持させる"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["uuid"], name: "index_search_persons_organizations_on_uuid", unique: true
  end

  create_table "series_deck_playlists", charset: "utf8mb4", force: :cascade do |t|
    t.bigint "series_deck_id", null: false, comment: "シリーズデッキID"
    t.bigint "series_playlist_id", null: false, comment: "シリーズプレイリストID"
    t.integer "position", default: 1, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["series_deck_id", "series_playlist_id"], name: "index_series_deck_and_playlist_id", unique: true
    t.index ["series_playlist_id", "position"], name: "index_series_deck_playlists_on_series_playlist_id_and_position"
  end

  create_table "series_decks", charset: "utf8mb4", force: :cascade do |t|
    t.string "name", null: false, comment: "デッキの名前"
    t.text "description", comment: "デッキの説明"
    t.string "string_id", null: false, comment: "計測用のdeckId（series-tv-for-）"
    t.string "deck_uid", null: false, comment: "デッキ uid"
    t.string "area"
    t.string "type_of_deck", default: "series", null: false, comment: "デッキを構成するプレイリストのタイプ"
    t.string "mode_of_item", default: "tv", null: false, comment: "デッキを構成するプレイリストのアイテムモード"
    t.string "type_of_item", default: "TVEpisode", null: false, comment: "デッキを構成するプレイリストのアイテムタイプ"
    t.string "interfix", null: false, comment: "deckId の中間接辞"
    t.integer "api_state", null: false, comment: "APIの公開状態 close: 0, open: 1, waiting: 2"
    t.string "admin_memo", comment: "管理メモ"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "series_playlists", charset: "utf8mb4", force: :cascade do |t|
    t.string "string_id", null: false, comment: "プレイリスト文字列ID（ts始まり)"
    t.string "series_id", null: false, comment: "シリーズID"
    t.string "type_of_list", default: "series", null: false, comment: "typeOfList"
    t.string "mode_of_item", default: "tv", null: false, comment: "modeOfItem"
    t.string "headline", comment: "見出し"
    t.text "marked_header", comment: "ヘッダー"
    t.text "article_body", size: :medium, comment: "記事本文"
    t.text "marked_body", size: :medium, comment: "記事本文（マークダウン）"
    t.text "marked_footer", comment: "フッター"
    t.json "editor_data", comment: "editorのjsonデータ"
    t.boolean "available_article", default: false, null: false, comment: "article が available かどうか"
    t.boolean "active_article", default: false, null: false, comment: "article の入力がアクティブかどうか"
    t.string "author_type", comment: "Person or Organization"
    t.string "author_name", comment: "著者名"
    t.string "publisher_type", comment: "Person or Organization"
    t.string "publisher_name", comment: "発行者名"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "supervisors", charset: "utf8mb4", force: :cascade do |t|
    t.bigint "person_organization_locals_id"
    t.bigint "playlist_id"
    t.json "image_data"
    t.string "type", comment: "Shrineのフォーマット"
    t.bigint "type_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["person_organization_locals_id"], name: "index_supervisors_on_person_organization_locals_id"
    t.index ["playlist_id"], name: "index_supervisors_on_playlist_id"
  end

  create_table "viaf_jsons", charset: "utf8mb4", force: :cascade do |t|
    t.string "viaf_id", null: false
    t.json "json", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["viaf_id"], name: "index_viaf_jsons_on_viaf_id", unique: true
  end

  create_table "wikidata_jsons", charset: "utf8mb4", force: :cascade do |t|
    t.string "wikidata_id", null: false
    t.json "basic_json", null: false
    t.json "property_json", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["wikidata_id"], name: "index_wikidata_jsons_on_wikidata_id", unique: true
  end

  create_table "wikidata_properties", charset: "utf8mb4", force: :cascade do |t|
    t.string "wikidata_id", null: false
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["wikidata_id"], name: "index_wikidata_properties_on_wikidata_id", unique: true
  end

  create_table "wikidata_same_as", charset: "utf8mb4", force: :cascade do |t|
    t.string "wikidata_id", null: false
    t.string "same_as_wikidata_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["wikidata_id"], name: "index_wikidata_same_as_on_wikidata_id", unique: true
  end

  add_foreign_key "article_images", "playlists"
  add_foreign_key "citations", "playlists"
  add_foreign_key "deck_playlists", "decks"
  add_foreign_key "deck_playlists", "playlists"
  add_foreign_key "deck_same_as", "decks"
  add_foreign_key "playlist_hashtags", "playlists"
  add_foreign_key "playlist_items", "playlists"
  add_foreign_key "playlist_keywords", "playlists"
  add_foreign_key "same_as", "playlists"
  add_foreign_key "series_deck_playlists", "series_decks"
  add_foreign_key "series_deck_playlists", "series_playlists"
  add_foreign_key "supervisors", "person_organization_locals", column: "person_organization_locals_id"
  add_foreign_key "supervisors", "playlists"
end
