namespace :deck_playlists do
  desc 'デッキとプレイリストの関連を多対多に変更する'
  task import_relation: :environment do
    Playlist.all.each do |playlist|
      next if playlist.deck_id.nil?

      DeckPlaylist.find_or_create(deck_id: playlist.deck_id, playlist_id: playlist.id)
    end
  end
end
