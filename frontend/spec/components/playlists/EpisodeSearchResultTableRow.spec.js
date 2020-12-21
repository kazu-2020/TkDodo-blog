import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import EpisodeSearchResultTableRow from '~/components/playlists/EpisodeSearchResultTableRow.vue'

Vue.use(Vuetify)

describe('components/playlists/EpisodeSearchResultTableRow.vue', () => {
  const mountFunction = (options) => {
    return mount(EpisodeSearchResultTableRow, {
      ...options,
    })
  }

  it('Vue instance を作れている', () => {
    const wrapper = mountFunction({
      propsData: {
        episode: { name: 'EP1', partOfSeries: { name: 'SR1' } },
        ignoreEpisodes: [],
      },
    })
    expect(wrapper.vm).toBeTruthy()
  })

  describe('computed shouldIgnoreEpisode', () => {
    describe('無視すべきエピソードがない場合', () => {
      it('false が返却される', () => {
        const wrapper = mountFunction({
          propsData: {
            episode: {
              name: 'EP1',
              id: 'XXXXXX',
              partOfSeries: { name: 'SR1' },
            },
            ignoreEpisodes: [],
          },
        })
        expect(wrapper.vm.shouldIgnoreEpisode).toBe(false)
      })
    })

    describe('無視すべきエピソードがある場合', () => {
      it('true が返却される', () => {
        const episodeId = 'XXXXXX'
        const wrapper = mountFunction({
          propsData: {
            episode: {
              name: 'EP1',
              id: episodeId,
              partOfSeries: { name: 'SR1' },
            },
            ignoreEpisodes: [{ id: episodeId }],
          },
        })
        expect(wrapper.vm.shouldIgnoreEpisode).toBe(true)
      })
    })
  })

  describe('computed eyecatchUrl', () => {
    describe('アイキャッチがない場合', () => {
      it('空文字が返却される', () => {
        const wrapper = mountFunction({
          propsData: {
            episode: {
              name: 'EP1',
              partOfSeries: { name: 'SR1' },
            },
            ignoreEpisodes: [],
          },
        })
        expect(wrapper.vm.eyecatchUrl).toBe('')
      })
    })

    describe('アイキャッチがある場合', () => {
      it('medium サイズのアイキャッチURLが返却される', () => {
        const url = 'https://example.com/image.jpg'
        const wrapper = mountFunction({
          propsData: {
            episode: {
              name: 'EP1',
              partOfSeries: { name: 'SR1' },
              eyecatch: { medium: { url } },
            },
            ignoreEpisodes: [],
          },
        })
        expect(wrapper.vm.eyecatchUrl).toBe(url)
      })
    })
  })

  describe('computed releaseDate', () => {
    describe('releaseEvent がない場合', () => {
      it('未設定が返却される', () => {
        const wrapper = mountFunction({
          propsData: {
            episode: {
              name: 'EP1',
              partOfSeries: { name: 'SR1' },
            },
            ignoreEpisodes: [],
          },
        })
        expect(wrapper.vm.releaseDate).toBe('未設定')
      })
    })

    describe('releaseEvent がある場合', () => {
      it('フォーマットされた日付が返却される', () => {
        const date = '2020-08-01 00:00:00'
        const wrapper = mountFunction({
          propsData: {
            episode: {
              name: 'EP1',
              partOfSeries: { name: 'SR1' },
              releasedEvent: { startDate: date },
            },
            ignoreEpisodes: [],
          },
        })
        expect(wrapper.vm.releaseDate).toBe('2020年8月01日（土）')
      })
    })
  })

  describe('method addEpisode', () => {
    it('エピソード追加イベントが発生すること', () => {
      const wrapper = mountFunction({
        propsData: {
          episode: {
            name: 'EP1',
            partOfSeries: { name: 'SR1' },
          },
          ignoreEpisodes: [],
        },
      })
      wrapper.find('.add_button').trigger('click')

      expect(wrapper.emitted()['add-episode'].length).toBe(1)
    })
  })
})
