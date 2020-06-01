const editorBlockMixin = {
  methods: {
    isEpisodeRelatedBlock(type) {
      return (
        type === 'episode' ||
        type === 'tvEvent' ||
        type === 'howTo' ||
        type === 'recipe'
      )
    },
  },
}

export default editorBlockMixin
