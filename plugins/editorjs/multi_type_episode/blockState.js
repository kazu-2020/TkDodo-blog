/**
 * 状態遷移の管理クラス
 */
class BlockState {
  /**
   * @param {object} api - Editor.js API
   */
  constructor(api) {
    this.api = api
    this.state = 'input'
  }

  /**
   * 状態遷移可能かを判定する
   */
  canTrasitToState(newState) {
    if (this.state === 'input' && newState === 'select') {
      this.api.notifier.show({
        message: 'エピソードを指定してから、タイプの切り替えをしてください',
        style: 'error',
      })
      return false
    } else if (this.state === 'select' && newState === 'input') {
      this.api.notifier.show({
        message: '不正なタイプ切り替えです',
        style: 'error',
      })
      return false
    } else {
      return true
    }
  }

  /**
   * 状態遷移させる
   */
  transitToState(newState) {
    if (this.canTrasitToState(newState)) {
      this.state = newState
    }
  }
}

export default BlockState
