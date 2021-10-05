import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, RouterLinkStub, createLocalVue } from '@vue/test-utils'
import ColorPalette from '~/components/playlists/ColorPalette.vue'
Vue.use(Vuetify)

describe('components/playlists/ColorPalette.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('Vue instance を作れている', () => {
    const wrapper = mount(ColorPalette, {
      stubs: {
        NuxtLink: RouterLinkStub,
      },
      propsData: { selectedPalette: '#005aff' },
      localVue,
      vuetify,
    })
    expect(wrapper.vm).toBeTruthy()
  })

  describe('Paletteを選択', () => {
    const localVue = createLocalVue()
    let vuetify

    beforeEach(() => {
      vuetify = new Vuetify()
    })

    it('「update:selectedPalette」イベントが発行されること', () => {
      const wrapper = mount(ColorPalette, {
        stubs: {
          NuxtLink: RouterLinkStub,
        },
        propsData: { selectedPalette: '#005aff' },
        localVue,
        vuetify,
      })
      wrapper.find('button.palette').trigger('click')

      expect(wrapper.emitted()['update:selectedPalette'].length).toBe(1)
    })
  })
})
