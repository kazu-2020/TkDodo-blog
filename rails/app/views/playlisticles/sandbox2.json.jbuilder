# frozen_string_literal: true

# rubocop:disable Metrics/BlockLength
json.playlisticle do
  json.article do
    json.time Time.current.to_i
    json.blocks do
      json.array! [
        {
          type: 'header',
          data: {
            text: "#{@playlist.name}の記事",
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'これから、こちらのプレイリストについて紹介します。'
          }
        },
        {
          type: 'episode',
          data: {
            url: 'https://example.com',
            episode: @playlist.playlist_items.kept.first.fetch_data
          }
        }
      ]
    end
  end
  json.playlist do
    json.partial! 'playlists/playlist', playlist: @playlist
  end
end
# rubocop:enable Metrics/BlockLength
