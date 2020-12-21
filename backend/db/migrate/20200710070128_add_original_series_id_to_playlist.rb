# frozen_string_literal: true

class AddOriginalSeriesIdToPlaylist < ActiveRecord::Migration[6.0]
  def change
    add_column :playlists, :original_series_id, :string, after: :string_id, comment: 'プレイリスト生成元のシリーズID'
  end
end
