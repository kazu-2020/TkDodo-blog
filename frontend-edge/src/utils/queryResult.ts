type QueryFetching = {
  isLoading: boolean
  isFetching: boolean
  isFetchingNextPage: boolean
}

export const isNewFetching = (query: QueryFetching) =>
  query.isLoading || (query.isFetching && !query.isFetchingNextPage)

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest
  describe('isNewFetching', () => {
    it('ローディングしていないとき', () => {
      const query = {
        isLoading: false,
        isFetching: false,
        isFetchingNextPage: false
      }
      expect(isNewFetching(query)).toBeFalsy()
    })

    it('最初のページをローディングしているとき', () => {
      const query = {
        isLoading: true,
        isFetching: true,
        isFetchingNextPage: false
      }
      expect(isNewFetching(query)).toBeTruthy()
    })

    it('最初のページをローディングしているとき（キャッシュから）', () => {
      const query = {
        isLoading: false,
        isFetching: true,
        isFetchingNextPage: false
      }
      expect(isNewFetching(query)).toBeTruthy()
    })

    it('次のページをローディングしているとき', () => {
      const query = {
        isLoading: false,
        isFetching: true,
        isFetchingNextPage: true
      }
      expect(isNewFetching(query)).toBeFalsy()
    })
  })
}
