import Vue from 'vue'
import Vuetify from 'vuetify'
import { shallowMount, RouterLinkStub, createLocalVue } from '@vue/test-utils'
import PlaylistIdArticlePage from '~/pages/playlists/_id/article.vue'

Vue.use(Vuetify)

const localVue = createLocalVue()

describe('pages/playlists/article.vue', () => {
  it('プレイリスト記事ページを表示できる', (done) => {
    const playlist = {
      id: 'XXXXXXXX',
      name: 'プレイリスト1',
    }
    const options = {
      localVue,
      stubs: {
        NuxtLink: RouterLinkStub,
      },
      mocks: {
        $vuetify: {
          lang: {
            t: (val) => val,
          },
        },
        $cookies: {
          get: () => '',
          set: (val) => val,
        },
      },
      vuetify: new Vuetify(),
    }

    const wrapper = shallowMount(PlaylistIdArticlePage, options)
    wrapper.setData({ playlist })
    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('.playlist-title').text()).toBe(
        'プレイリスト1 の記事編集ページ'
      )
      done()
    })
  })
})
