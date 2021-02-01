import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, createLocalVue } from '@vue/test-utils'
import PlaylistJsonDialog from '~/components/playlists/PlaylistJsonDialog.vue'

Vue.use(Vuetify)

describe('components/playlists/PlaylistJsonDialog.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('Vue instance を作れている', () => {
    const wrapper = mount(PlaylistJsonDialog, {
      localVue,
      vuetify,
      propsData: { playlistId: 'XXXXX' },
    })
    expect(wrapper.vm).toBeTruthy()
  })
})
