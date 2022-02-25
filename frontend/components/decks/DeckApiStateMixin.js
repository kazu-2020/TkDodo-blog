const deckApiStateMixin = {
  computed: {
    deckApiStateTitle() {
      return this.deck?.apiState === 'open' ? '公開中' : '非公開'
    },
    deckApiStateColor() {
      return this.deck?.apiState === 'open' ? 'pink' : 'grey'
    },
  },
}

export default deckApiStateMixin
