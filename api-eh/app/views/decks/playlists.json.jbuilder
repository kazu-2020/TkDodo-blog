json.playlists do
  json.array! @playlists, partial: 'playlists/playlist', as: :playlist
end

json.pagination do
  json.count @playlists.count
  json.totalPages @playlists.total_pages
  json.currentPage @playlists.current_page
  json.nextPage @playlists.next_page
  json.previousPage @playlists.prev_page
  json.isFirstPage @playlists.first_page?
  json.isLastPage @playlists.last_page?
end
