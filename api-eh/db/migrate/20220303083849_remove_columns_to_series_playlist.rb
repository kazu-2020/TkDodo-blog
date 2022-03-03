class RemoveColumnsToSeriesPlaylist < ActiveRecord::Migration[6.1]
  def change
    remove_column :series_playlists, :active_item_list, :boolean
    remove_column :series_playlists, :active_episode, :boolean
    remove_column :series_playlists, :active_faq_page, :boolean
    remove_column :series_playlists, :active_how_to, :boolean
    remove_column :series_playlists, :active_event, :boolean
    remove_column :series_playlists, :api_state, :integer
    remove_column :series_playlists, :open_scheduled_at, :datetime
    remove_column :series_playlists, :close_scheduled_at, :datetime
    remove_column :series_playlists, :published_at, :datetime
    remove_column :series_playlists, :layout_pattern, :string
  end
end
