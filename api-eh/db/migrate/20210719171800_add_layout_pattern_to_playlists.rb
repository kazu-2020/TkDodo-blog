# frozen_string_literal: true

class AddLayoutPatternToPlaylists < ActiveRecord::Migration[6.0]
  def change
    add_column :playlists, :layout_pattern, :string, default: 'summary',
                null: false, after: :playable_total_time, comment: 'レイアウトパターン'
  end
end
