export interface Pagination {
  count: number
  totalPages: number
  currentPage: number
  nextPage: number | null
  previousPage: number | null
  isFirstPage: boolean
  isLastPage: boolean
}
