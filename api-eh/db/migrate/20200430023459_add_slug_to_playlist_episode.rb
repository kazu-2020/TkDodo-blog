class AddSlugToPlaylistEpisode < ActiveRecord::Migration[6.0]
  def change
    add_column :playlist_episodes, :slug, :string
    add_index :playlist_episodes, :slug, unique: true
  end
end
