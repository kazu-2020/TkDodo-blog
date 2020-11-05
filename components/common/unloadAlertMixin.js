const message = '編集中の情報は保存されません。よろしいですか？'

const confirmUnload = function (event) {
  event.preventDefault()
  event.returnValue = message
}

export default {
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
  beforeRouteLeave(_to, _from, next) {
    let canMove = true
    if (this.isShowUnloadAlert) {
      canMove = window.confirm(message)
    }
    next(canMove)
  },
}
