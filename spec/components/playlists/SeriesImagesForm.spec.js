import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, RouterLinkStub } from '@vue/test-utils'
import SeriesImagesForm from '~/components/playlists/SeriesImagesForm.vue'
Vue.use(Vuetify)

describe('components/playlists/SeriesImagesForm.vue', () => {
  it('Vue instance を作れている', () => {
    const wrapper = mount(SeriesImagesForm, {
      stubs: {
        NuxtLink: RouterLinkStub,
      },
      propsData: { playlist: {} },
    })
    expect(wrapper.vm).toBeTruthy()
  })
})
