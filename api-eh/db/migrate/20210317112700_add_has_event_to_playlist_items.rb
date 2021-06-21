# frozen_string_literal: true

class AddHasEventToPlaylistItems < ActiveRecord::Migration[6.0]
  def change
    add_column :playlist_items, :has_how_to,
               :boolean, default: false, null: false, after: :has_video, comment: 'ハウツー保持フラグ'
    add_column :playlist_items, :has_event,
               :boolean, default: false, null: false, after: :has_how_to, comment: 'イベント保持フラグ'
    add_column :playlists, :output_episode_to_bundle,
               :boolean, default: true, after: :editor_data, comment: 'bundle にてエピソードを出力するかのフラグ'
    add_column :playlists, :output_article_to_bundle,
               :boolean, default: false, after: :output_episode_to_bundle, comment: 'bundle にて記事を出力するかのフラグ'
    add_column :playlists, :output_how_to_to_bundle,
               :boolean, default: false, after: :output_article_to_bundle, comment: 'bundle にてハウツーを出力するかのフラグ'
    add_column :playlists, :output_event_to_bundle,
               :boolean, default: false, after: :output_how_to_to_bundle, comment: 'bundle にてイベントを出力するかのフラグ'
  end
end
