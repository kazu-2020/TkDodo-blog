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
      propsData: { playlist: { dateModified: '2022-04-25T08:15:00+09:00' } },
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
          propsData: {
            playlist: { dateModified: '2022-04-25T08:15:00+09:00' },
          },
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
          propsData: {
            playlist: {
              dateModified: '2022-04-25T08:15:00+09:00',
              logo: { medium: { url: logoUrl } },
            },
          },
        })
        expect(wrapper.vm.logoImageUrl).toBe(logoUrl)
      })
    })
  })
})
