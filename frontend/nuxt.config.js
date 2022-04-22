import colors from 'vuetify/es5/util/colors'

const environment = process.env.NODE_ENV || 'development'
const envSet = require(`./env.${environment}.js`)

export default {
  env: { ...envSet, environment }, // 実行時にNODE_ENVがproductionになるためenvironmentを設定
  ssr: false,
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#56b78b',
    continuous: true,
    height: '3px',
  },
  /*
   ** Global CSS
   */
  css: [
    '@assets/css/main.scss',
    'vue-json-pretty/lib/styles.css',
    'video.js/dist/video-js.css',
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/vue-json-pretty',
    '~/plugins/vue-scrollto.js',
    '~/plugins/vue-the-mask.js',
    '~/plugins/axios.js',
    '~/plugins/error-handler.js',
  ],
  router: {
    middleware: environment === 'development' ? [] : ['auth'],
  },
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    [
      '@nuxtjs/google-fonts',
      {
        families: { 'Noto Sans JP': true },
        display: 'block',
        preload: true,
      },
    ],
    '@nuxt/typescript-build',
    'nuxt-typed-vuex',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    [
      '@nuxtjs/vuetify',
      {
        /* module options */
      },
    ],
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    ['@nuxtjs/moment', ['ja']],
    ['cookie-universal-nuxt', { parseJSON: false }],
  ],
  auth: {
    redirect: {
      login: '/auth/login', // User will be redirected to this path if login is required.
      logout: '/auth', // User will be redirected to this path if after logout, current route is protected.
      callback: '/auth', // User will be redirected to this path by the identity provider after login.
      home: '/auth', // User will be redirect to this path after login.
    },
    strategies: {
      local: false,
      auth0: {
        domain: envSet.AUTH0_DOMAIN,
        clientId: envSet.AUTH0_CLIENT_ID,
        audience: envSet.AUTH0_AUDIENCE,
      },
    },
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: process.env.API_BASE_URL || envSet.apiBaseUrl,
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: '#009688',
          secondary: '#cddc39',
          accent: '#ff9800',
          error: '#f44336',
          warning: '#ff5722',
          info: '#607d8b',
          success: '#8bc340',
          text: '#000',
        },
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          text: '#FFF',
        },
      },
    },
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save FIXME: 消しても問題ないか確認する
      if (ctx.isDev && ctx.isClient) {
        config.devtool = 'inline-cheap-module-source-map'
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        })
      }
      // Sentry用のソースマップを作る
      if (process.env.MODE === 'ci' && ctx.isClient) {
        config.devtool = 'source-map'
      }
    },
    transpile: [/typed-vuex/],
    babel: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              ie: '11',
            },
            useBuiltIns: 'usage',
            corejs: 3,
          },
        ],
      ],
    },
  },
}
