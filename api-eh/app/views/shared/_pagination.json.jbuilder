json.pagination do
  json.count record.count
  json.totalPages record.total_pages
  json.currentPage record.current_page
  json.nextPage record.next_page
  json.previousPage record.prev_page
end
