const editorBlockMixin = {
  methods: {
    makeEpisodeBlockId(selectedSection) {
      const block = selectedSection.data.blocks.find(b =>
        this.isEpisodeRelatedBlock(b.type)
      )
      if (block) {
        return block.data.link
      } else {
        return 'default'
      }
    },
    typeOfEpisodeRelatedBlock(section) {
      return section.data.blocks.find(b => this.isEpisodeRelatedBlock(b.type))
        .type
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
