import Vue from 'vue'

const message = '編集中の情報は保存されません。よろしいですか？'

const confirmUnload = function (event: any) {
  event.preventDefault()
  event.returnValue = message
}

export default Vue.extend({
  name: 'UnloadAlertMixin',
  beforeRouteLeave(_to, _from, next) {
    if (this.isShowUnloadAlert && !window.confirm(message)) {
      next(false)
    } else {
      next()
    }
  },
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
      window.removeEventListener('beforeunload', confirmUnload)
    },
    showUnloadAlert(): void {
      this.isShowUnloadAlert = true
      window.addEventListener('beforeunload', confirmUnload)
    },
  },
})
