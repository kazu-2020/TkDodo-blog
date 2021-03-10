<template>
  <div>
    <video
      ref="videoPlayer"
      class="video-js vjs-fluid"
      data-setup="{}"
      controls
    />
  </div>
</template>

<script>
import videojs from 'video.js'

export default {
  name: 'VideoPlayer',
  props: {
    src: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      player: null,
    }
  },
  mounted() {
    this.player = videojs(this.$refs.videoPlayer, { fluid: true })
    this.player.src(this.src)
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose()
    }
  },
}
</script>
