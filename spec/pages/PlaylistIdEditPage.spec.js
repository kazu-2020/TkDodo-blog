import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, RouterLinkStub, createLocalVue } from '@vue/test-utils'
import PlaylistIdEditPage from '~/pages/playlists/_id/edit.vue'

Vue.use(Vuetify)

const localVue = createLocalVue()

describe('pages/playlists/edit.vue', () => {
  it('プレイリスト編集ページを表示できる', () => {
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
      },
      vuetify: new Vuetify(),
    }

    const wrapper = mount(PlaylistIdEditPage, options)
    wrapper.setData({ editingPlaylist: playlist })

    expect(wrapper.find('.title').text()).toBe('メタ情報の編集')
  })
})
