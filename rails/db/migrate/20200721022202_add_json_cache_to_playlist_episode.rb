# frozen_string_literal: true

class AddJsonCacheToPlaylistEpisode < ActiveRecord::Migration[6.0]
  def change
    remove_column :playlist_episodes, :slug, :string
    add_column :playlist_episodes, :cached_data, :text, after: :position, comment: 'r6 API からのエピソードJSONのキャッシュ'
    add_column :playlist_episodes, :cached_data_at, :datetime, after: :cached_data, comment: 'cache_data を保存した日時'
  end
end
