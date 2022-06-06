import DummyImageHelper from '~/utils/DummyImageHelper'

describe('utils/DummyImageHelper.ts', () => {
  describe('#getPath', () => {
    it('ダミー画像のパスが取得できること', () => {
      expect(
        DummyImageHelper.getPath('2022-04-25T08:15:00+09:00', 'logo')
      ).toBe(`/dummy/default6/default6-logo.png`)
    })
  })
})
