import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, RouterLinkStub, createLocalVue } from '@vue/test-utils'
import PlaylistItem from '~/components/common/PlaylistItem.vue'
Vue.use(Vuetify)

describe('components/common/PlaylistItem.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('Vue instance を作れている', () => {
    const wrapper = mount(PlaylistItem, {
      localVue,
      vuetify,
      stubs: {
        NuxtLink: RouterLinkStub,
      },
      mocks: {
        $axios: {
          get: () => Promise.resolve({ data: { items: [] } }),
        },
      },
      propsData: { playlist: {} },
    })
    expect(wrapper.vm).toBeTruthy()
  })

  describe('computed logoImageUrl', () => {
    describe('プレイリストにロゴ情報がない', () => {
      it('default1 の画像を返却する', () => {
        const wrapper = mount(PlaylistItem, {
          localVue,
          vuetify,
          stubs: {
            NuxtLink: RouterLinkStub,
          },
          mocks: {
            $axios: {
              get: () => Promise.resolve({ data: { items: [] } }),
            },
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
          localVue,
          vuetify,
          stubs: {
            NuxtLink: RouterLinkStub,
          },
          mocks: {
            $axios: {
              get: () => Promise.resolve({ data: { items: [] } }),
            },
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
          localVue,
          vuetify,
          stubs: {
            NuxtLink: RouterLinkStub,
          },
          mocks: {
            $axios: {
              get: () => Promise.resolve({ data: { items: [] } }),
            },
          },
          propsData: { playlist: {} },
        })
        expect(wrapper.vm.dummyImage).toBe('/dummy/default1/default1-logo.png')
      })
    })
    describe('プレイリストに作成日がある', () => {
      it('日付から決定された画像パスを返却', () => {
        const wrapper = mount(PlaylistItem, {
          localVue,
          vuetify,
          stubs: {
            NuxtLink: RouterLinkStub,
          },
          mocks: {
            $axios: {
              get: () => Promise.resolve({ data: { items: [] } }),
            },
          },
          propsData: { playlist: { dateCreated: '2020-07-21 00:00:00' } },
        })
        expect(wrapper.vm.dummyImage).toBe('/dummy/default2/default2-logo.png')
      })
    })
  })
})
