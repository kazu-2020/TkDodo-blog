import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, RouterLinkStub } from '@vue/test-utils'
import ColorPalette from '~/components/playlists/ColorPalette.vue'
Vue.use(Vuetify)

describe('components/playlists/ColorPalette.vue', () => {
  it('Vue instance を作れている', () => {
    const wrapper = mount(ColorPalette, {
      stubs: {
        NuxtLink: RouterLinkStub,
      },
      propsData: { selectedPalette: '#005aff' },
    })
    expect(wrapper.vm).toBeTruthy()
  })

  describe('Paletteを選択', () => {
    it('「update:selectedPalette」イベントが発行されること', () => {
      const wrapper = mount(ColorPalette, {
        stubs: {
          NuxtLink: RouterLinkStub,
        },
        propsData: { selectedPalette: '#005aff' },
      })
      wrapper.find('button.palette').trigger('click')

      expect(wrapper.emitted()['update:selectedPalette'].length).toBe(1)
    })
  })
})
