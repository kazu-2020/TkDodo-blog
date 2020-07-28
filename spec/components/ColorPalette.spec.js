import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, RouterLinkStub } from '@vue/test-utils'
import PlaylistItem from '~/components/PlaylistItem.vue'
Vue.use(Vuetify)

describe('components/PlaylistItem.vue', () => {
  it('Vue instance を作れている', () => {
    const wrapper = mount(PlaylistItem, {
      stubs: {
        NuxtLink: RouterLinkStub,
      },
      propsData: { playlist: {} },
    })
    expect(wrapper.vm).toBeTruthy()
  })

  describe('method deletePlaylist', () => {
    it('プレイリスト削除イベントが発行されること', () => {
      // Confirm ダイアログをスタブする
      window.confirm = jest.fn().mockImplementation(() => true)

      const wrapper = mount(PlaylistItem, {
        stubs: {
          NuxtLink: RouterLinkStub,
        },
        propsData: { playlist: {} },
      })
      wrapper.find('.delete_button').trigger('click')

      expect(wrapper.emitted()['delete-playlist'].length).toBe(1)
    })
  })
})
