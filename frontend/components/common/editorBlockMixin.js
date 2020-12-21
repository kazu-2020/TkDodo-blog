const editorBlockMixin = {
  methods: {
    makeEpisodeBlockId(selectedSection) {
      const block = selectedSection.data.blocks.find((b) =>
        this.isEpisodeRelatedBlock(b.type)
      )
      if (block) {
        return block.data.link
      } else {
        return 'default'
      }
    },
    typeOfEpisodeRelatedBlock(section) {
      const blocks = section.data.blocks.find((b) =>
        this.isEpisodeRelatedBlock(b.type)
      )

      if (!blocks) {
        return
      }

      return blocks.type
    },
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
