class AddHeadlineToSeriesPlaylist < ActiveRecord::Migration[6.1]
  def change
    add_column :series_playlists, :headline, :string, after: :mode_of_item, comment: "見出し"
  end
end
