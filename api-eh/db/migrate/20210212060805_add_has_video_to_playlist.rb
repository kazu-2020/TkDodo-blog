# frozen_string_literal: true

class AddHasVideoToPlaylist < ActiveRecord::Migration[6.0]
  def change
    add_column :playlist_items, :has_video, :boolean, default: false, null: false, after: :duration, comment: '再生可能な動画があるか'
  end
end
