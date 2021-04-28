# frozen_string_literal: true

json.dateCreated playlist.created_at
json.dateModified playlist.updated_at
json.description playlist.description
json.detailedCatch playlist.detailed_catch

json.partial! 'shared/playlist_images', playlist: playlist

json.id playlist.original_id

json.identifierGroup do
  json.playlistUId playlist.string_id
  json.playlistId playlist.original_id
  json.playlistName playlist.name
  json.typeOfList 'recommend'
  json.modeOfItem 'tv'
  json.typeOfItem type_of_item(object_type)
  json.hashtag playlist.hashtags
  json.aliasId playlist.alias_id || ''
  json.formatGenreTag format_genre(playlist)
  json.themeGenreTag theme_genre(playlist)
end

if playlist.deck.present?
  json.relatedDeck do
    json.array! [playlist.deck] do |deck|
      deck_id = deck.deck_id(deck_type)
      json.type 'NDeck'
      json.id deck_id
      json.name playlist.deck.name
      json.description playlist.deck.description
      json.identifierGroup do
        json.deckUId playlist.deck.deck_uid(deck_id)
        json.deckId deck_id
        json.deckName playlist.deck.name
        json.typeOfDeck playlist.deck.item_type
      end
      json.url deck_url(playlist.deck, deck_id, object_type)
    end
  end
end

json.name playlist.name
json.style do
  json.primaryLight playlist.primary_light_color
  json.primaryDark playlist.primary_dark_color
  json.textLight playlist.text_light_color
  json.textDark playlist.text_dark_color
  json.linkLight playlist.link_light_color
  json.linkDark playlist.link_dark_color
end

json.type 'NPlaylist'
if playlist.same_as.present?
  json.sameAs do
    json.name playlist.same_as.name
    json.url playlist.same_as.url
  end
else
  json.sameAs nil
end

json.url "https://dev-api-eh.nr.nhk.jp/d6.6/t/nplaylist/pl/#{playlist.original_id}.json?area=#{area}"
