# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_04_19_171000) do

  create_table "article_images", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.integer "playlist_id", comment: "プレイリストID", unsigned: true
    t.text "image_data"
    t.string "image_id", comment: "Shrine が生成する画像ID"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["image_id"], name: "idx_image_id"
    t.index ["playlist_id"], name: "index_article_images_on_playlist_id"
  end

  create_table "citations", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.integer "playlist_id", null: false
    t.string "name", null: false
    t.string "url", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "decks", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.string "name"
    t.text "description", comment: "デッキの説明"
    t.string "area"
    t.string "item_type", default: "recommend", comment: "デッキを構成するプレイリストのタイプ"
    t.boolean "is_r5", default: false, null: false, comment: "r5 相当のデッキか"
    t.string "visible_uid", comment: "Editorial APIレスポンス時のUID"
    t.string "editorial_uid", comment: "Visible APIレスポンス時のUID"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "playlist_hashtags", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.bigint "playlist_id", null: false
    t.text "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["playlist_id"], name: "index_playlist_hashtags_on_playlist_id"
  end

  create_table "playlist_items", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.integer "playlist_id", null: false
    t.string "episode_id", null: false
    t.string "context", comment: "アイテムの種別(Type)"
    t.string "item_id", comment: "コンテキストに紐づくアイテムのID"
    t.integer "position", default: 1, null: false
    t.integer "duration", comment: "エピソードの再生時間"
    t.boolean "has_video", default: false, null: false, comment: "再生可能な動画があるか"
    t.boolean "has_how_to", default: false, null: false, comment: "ハウツー保持フラグ"
    t.boolean "has_event", default: false, null: false, comment: "イベント保持フラグ"
    t.boolean "has_faq_page", default: false, null: false, comment: "FAQ 保持フラグ"
    t.text "cached_data", comment: "r6 API からのエピソードJSONのキャッシュ"
    t.datetime "discarded_at", comment: "削除日時"
    t.datetime "cached_data_at", comment: "cache_data を保存した日時"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["discarded_at"], name: "index_playlist_items_on_discarded_at"
    t.index ["playlist_id"], name: "idx_playlist_id"
  end

  create_table "playlist_keywords", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.bigint "playlist_id", null: false
    t.text "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["playlist_id"], name: "index_playlist_keywords_on_playlist_id"
  end

  create_table "playlists", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.string "name"
    t.string "detailed_name_ruby"
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
    t.string "string_id", comment: "プレイリスト文字列ID"
    t.integer "deck_id", comment: "デッキID"
    t.string "original_series_id", comment: "プレイリスト生成元のシリーズID"
    t.string "alias_id", comment: "短縮URL"
    t.string "d5_playlist_id", comment: "r5 デッキのプレイリストID"
    t.integer "playlist_items_count", default: 0, null: false
    t.integer "playable_playlist_items_count", default: 0, comment: "再生可能なエピソード数"
    t.integer "total_time", default: 0, comment: "プレイリストの総時間"
    t.integer "playable_total_time", default: 0, comment: "プレイリスト再生可能時間"
    t.text "marked_header", comment: "ヘッダー"
    t.text "article_body", size: :medium, comment: "記事本文"
    t.text "marked_body", size: :medium, comment: "記事本文（マークダウン）"
    t.text "marked_footer", comment: "フッター"
    t.json "editor_data", comment: "editorのjsonデータ"
    t.boolean "output_item_list_to_bundle", default: false, comment: "bundle にてNItemListを出力するかのフラグ"
    t.boolean "output_episode_to_bundle", default: true, comment: "bundle にてエピソードを出力するかのフラグ"
    t.boolean "output_faq_page_to_bundle", default: false, comment: "bundle にてFAQを出力するかのフラグ"
    t.boolean "output_article_to_bundle", default: false, comment: "bundle にて記事を出力するかのフラグ"
    t.boolean "output_how_to_to_bundle", default: false, comment: "bundle にてハウツーを出力するかのフラグ"
    t.boolean "output_event_to_bundle", default: false, comment: "bundle にてイベントを出力するかのフラグ"
    t.string "author_type", comment: "Person or Organization"
    t.string "author_name", comment: "著者名"
    t.string "publisher_type", comment: "Person or Organization"
    t.string "publisher_name", comment: "発行者名"
    t.string "published_state", default: "draft", null: false, comment: "公開状態"
    t.datetime "reserve_publish_time_at"
    t.datetime "reserve_finish_time_at", comment: "公開終了日時"
    t.datetime "published_at", comment: "公開日時"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["alias_id"], name: "index_playlists_on_alias_id", unique: true
    t.index ["string_id"], name: "index_playlists_on_string_id", unique: true
  end

  create_table "same_as", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.integer "playlist_id", null: false
    t.string "name", null: false
    t.string "url", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["playlist_id"], name: "idx_playlist_id", unique: true
  end

  add_foreign_key "playlist_hashtags", "playlists"
  add_foreign_key "playlist_keywords", "playlists"
end
