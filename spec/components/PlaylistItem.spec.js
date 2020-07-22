import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, RouterLinkStub } from '@vue/test-utils'
import PlaylistItem from '../../components/PlaylistItem.vue'
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

  describe('computed totalTime', () => {
    it('変換された時間を返却する', () => {
      const wrapper = mount(PlaylistItem, {
        stubs: {
          NuxtLink: RouterLinkStub,
        },
        propsData: { playlist: { totalTime: 5715 } },
      })
      expect(wrapper.vm.totalTime).toBe('01:35:15')
    })

    it('totalTime が null でも所定の結果を返却する', () => {
      const wrapper = mount(PlaylistItem, {
        stubs: {
          NuxtLink: RouterLinkStub,
        },
        propsData: { playlist: {} },
      })
      expect(wrapper.vm.totalTime).toBe('--:--:--')
    })
  })

  describe('computed logoImageUrl', () => {
    describe('プレイリストにロゴ情報がない', () => {
      it('default1 の画像を返却する', () => {
        const wrapper = mount(PlaylistItem, {
          stubs: {
            NuxtLink: RouterLinkStub,
          },
          propsData: { playlist: {} },
        })
        expect(wrapper.vm.logoImageUrl).toBe(
          '/dummy/default1/default1-logo.png'
        )
      })
    })

    describe('プレイリストにロゴ情報がある', () => {
      it('プレイリストに含まれるロゴ情報を返却する', () => {
        const logoUrl = 'https://example.com/logo.jpg'
        const wrapper = mount(PlaylistItem, {
          stubs: {
            NuxtLink: RouterLinkStub,
          },
          propsData: { playlist: { logo: { medium: { url: logoUrl } } } },
        })
        expect(wrapper.vm.logoImageUrl).toBe(logoUrl)
      })
    })
  })

  describe('computed dummyImage', () => {
    describe('プレイリストに作成日がない', () => {
      it('固定の画像パスを返却', () => {
        const wrapper = mount(PlaylistItem, {
          stubs: {
            NuxtLink: RouterLinkStub,
          },
          propsData: { playlist: {} },
        })
        expect(wrapper.vm.dummyImage).toBe('/dummy/default1/default1-logo.png')
      })
    })
    describe('プレイリストに作成日がある', () => {
      it('日付から決定された画像パスを返却', () => {
        const wrapper = mount(PlaylistItem, {
          stubs: {
            NuxtLink: RouterLinkStub,
          },
          propsData: { playlist: { dateCreated: '2020-07-21 00:00:00' } },
        })
        expect(wrapper.vm.dummyImage).toBe('/dummy/default2/default2-logo.png')
      })
    })
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
