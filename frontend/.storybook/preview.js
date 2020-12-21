import { configure, addDecorator } from '@storybook/vue'
import { withKnobs } from '@storybook/addon-knobs/vue'
import { withInfo } from 'storybook-addon-vue-info'
import { action } from '@storybook/addon-actions'
import addons from '@storybook/addons'

import Vue from 'vue'
import Vuex from 'vuex'

import Vuetify from 'vuetify'
import { VApp, VMain } from 'vuetify/lib'
import colors from 'vuetify/es5/util/colors'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuex)
const vuetifyOptions = {}

Vue.use(Vuetify, {
  iconfont: 'mdi',
  customVariables: ['~/assets/variables.scss'],
  theme: {
    dark: true,
    themes: {
      light: {
        primary: colors.purple,
        secondary: colors.grey.darken1,
        accent: colors.shades.black,
        error: colors.red.accent3,
      },
      dark: {
        primary: colors.blue.darken2,
        accent: colors.grey.darken3,
        secondary: colors.amber.darken3,
        info: colors.teal.lighten1,
        warning: colors.amber.base,
        error: colors.deepOrange.accent4,
        success: colors.green.accent3,
      },
    },
  },
})

// nuxt-link を action に送る
Vue.component('nuxt-link', {
  props: ['to'],
  methods: {
    log() {
      action('link target')(this.to)
    },
  },
  template: '<a href="#" @click.prevent="log()"><slot>NuxtLink</slot></a>',
})

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.stories.js$/)
function loadStories() {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
addDecorator(() => ({
  vuetify: new Vuetify(vuetifyOptions),
  components: { VApp, VMain },
  template: `<v-app><v-main><story/></v-main></v-app>`,
}))
addDecorator(
  withKnobs({
    escapeHTML: false,
  })
)
addDecorator(withInfo)

const channel = addons.getChannel()
let _isDark = false

channel.on('DARK_MODE', isDark => {
  if (isDark) {
    document.getElementById('app').classList.add('theme--dark')
    document.getElementById('app').classList.remove('theme--light')
    _isDark = false
  } else {
    document.getElementById('app').classList.remove('theme--dark')
    document.getElementById('app').classList.add('theme--light')
    _isDark = true
  }
})

channel.on('storyRendered', () => {
  if (_isDark) {
    document.getElementById('app').classList.add('theme--dark')
    document.getElementById('app').classList.remove('theme--light')
  } else {
    document.getElementById('app').classList.remove('theme--dark')
    document.getElementById('app').classList.add('theme--light')
  }
})

channel.on('storybookjs/knobs/change', () => {
  _isDark = document.getElementById('app').classList.contains('theme--dark')
})
