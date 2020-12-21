import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import PlaylistJsonDialog from '~/components/playlists/PlaylistJsonDialog.vue'

Vue.use(Vuetify)

describe('components/playlists/PlaylistJsonDialog.vue', () => {
  it('Vue instance を作れている', () => {
    const wrapper = mount(PlaylistJsonDialog, {
      propsData: { playlistId: 'XXXXX' },
    })
    expect(wrapper.vm).toBeTruthy()
  })
})
