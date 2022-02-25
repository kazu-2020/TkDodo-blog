# frozen_string_literal: true

class AddTempSeriesDeckDataJob < SidekiqBaseJob
  sidekiq_options queue: 'p1'

  def perform # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
    # sports
    sports_deck = SeriesDeck.find_or_create_by!(string_id: 'series-tv-for-sports-00001') do |series_deck|
      series_deck.name = 'sports'
      series_deck.deck_uid = SecureRandom.uuid
      series_deck.interfix = 'sports'
    end

    [{ string_id: 'ts-78N6R48RW6', series_id: '78N6R48RW6' },
     { string_id: 'ts-QL31MN9ZQ4', series_id: 'QL31MN9ZQ4' },
     { string_id: 'ts-B643RRNKPM', series_id: 'B643RRNKPM' },
     { string_id: 'ts-J6255WVG4Q', series_id: 'J6255WVG4Q' }].each do |data|
      series_playlist = SeriesPlaylist.find_or_initialize_by(data)
      sports_deck.series_playlists << series_playlist if series_playlist.new_record?
    end

    # kids
    kids_deck = SeriesDeck.find_or_create_by!(string_id: 'series-tv-for-kids-00002') do |series_deck|
      series_deck.name = 'kids'
      series_deck.deck_uid = SecureRandom.uuid
      series_deck.interfix = 'kids'
    end

    [{ string_id: 'ts-2QQKWV9GM9', series_id: '2QQKWV9GM9' },
     { string_id: 'ts-ZZR21863JJ', series_id: 'ZZR21863JJ' },
     { string_id: 'ts-K15G627MP9', series_id: 'K15G627MP9' },
     { string_id: 'ts-J71ZMW193K', series_id: 'J71ZMW193K' },
     { string_id: 'ts-K8MXJPY2MM', series_id: 'K8MXJPY2MM' }].each do |data|
      series_playlist = SeriesPlaylist.find_or_initialize_by(data)
      kids_deck.series_playlists << series_playlist if series_playlist.new_record?
    end

    # documentary_deck
    documentary_deck = SeriesDeck.find_or_create_by!(string_id: 'series-tv-for-documentary-00003') do |series_deck|
      series_deck.name = 'documentary'
      series_deck.deck_uid = SecureRandom.uuid
      series_deck.interfix = 'documentary'
    end

    [{ string_id: 'ts-4LP7MJWPN9', series_id: '4LP7MJWPN9' },
     { string_id: 'ts-Q71GKGX4XP', series_id: 'Q71GKGX4XP' },
     { string_id: 'ts-W3W8WRN8M3', series_id: 'W3W8WRN8M3' },
     { string_id: 'ts-88Z7X45XZY', series_id: '88Z7X45XZY' }].each do |data|
      series_playlist = SeriesPlaylist.find_or_initialize_by(data)
      documentary_deck.series_playlists << series_playlist if series_playlist.new_record?
    end
  end
end
