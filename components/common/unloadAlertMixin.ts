import Vue from 'vue'

const message = '編集中の情報は保存されません。よろしいですか？'

const confirmUnload = function (event: any) {
  event.preventDefault()
  event.returnValue = message
}

export default Vue.extend({
  name: 'UnloadAlertMixin',
  data() {
    return {
      isShowUnloadAlert: false,
    }
  },
  created() {
    if (process.client) {
      window.addEventListener('beforeunload', confirmUnload)
    }
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', confirmUnload)
  },
  methods: {
    notShowUnloadAlert(): void {
      this.isShowUnloadAlert = false
    },
    showUnloadAlert(): void {
      this.isShowUnloadAlert = true
    },
  },
  beforeRouteLeave(_to, _from, next) {
    if (this.isShowUnloadAlert && !window.confirm(message)) {
      next(false)
    } else {
      next()
    }
  },
})
