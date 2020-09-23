import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, RouterLinkStub } from '@vue/test-utils'
import PlaylistIndexPage from '~/pages/index.vue'
Vue.use(Vuetify)

describe('pages/index.vue', () => {
  it('プレイリスト一覧を表示できる', () => {
    const playlist = {
      id: 'XXXXXXXX',
      name: 'プレイリスト1',
    }
    const options = {
      stubs: {
        NuxtLink: RouterLinkStub,
      },
      mocks: {
        $store: {
          state: {
            playlists: { allItems: [playlist], pagination: { totalPages: 1 } },
          },
        },
        $axios: {
          get: () => Promise.resolve({ data: { items: [] } }),
        },
      },
    }

    const wrapper = mount(PlaylistIndexPage, options)
    expect(wrapper.find('.title').text()).toBe('プレイリスト一覧')
    expect(wrapper.find('.playlist-title').text()).toBe('プレイリスト1')
  })
})
