import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, RouterLinkStub, createLocalVue } from '@vue/test-utils'
import PlaylistIdArticlePage from '~/pages/playlists/_id/article.vue'
import StubComponent from '~/spec/fixture/StubComponent.vue'

Vue.use(Vuetify)

const localVue = createLocalVue()

describe('pages/playlists/article.vue', () => {
  it('プレイリスト記事ページを表示できる', (done) => {
    const playlist = {
      id: 'XXXXXXXX',
      name: 'プレイリスト1',
    }
    const options = {
      localVue,
      stubs: {
        NuxtLink: RouterLinkStub,
        'editable-section': StubComponent,
      },
      mocks: {
        $vuetify: {
          lang: {
            t: (val) => val,
          },
        },
        $cookies: {
          get: () => '',
          set: (val) => val,
        },
      },
      vuetify: new Vuetify(),
    }

    const wrapper = mount(PlaylistIdArticlePage, options)
    wrapper.setData({ playlist })
    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('.title').text()).toBe(
        'プレイリスト1 の記事編集ページ'
      )
      done()
    })
  })
})
