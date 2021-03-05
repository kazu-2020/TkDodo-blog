<template>
  <div>
    <video ref="videoPlayer" class="video-js" />
  </div>
</template>

<script>
import videojs from 'video.js'
import eme from 'videojs-contrib-eme'

export default {
  name: 'VideoPlayer',
  props: {
    options: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      player: null,
    }
  },
  mounted() {
    videojs.registerPlugin('videojs-contrib-eme', eme)
    this.player = videojs(
      this.$refs.videoPlayer,
      this.options,
      function onPlayerReady() {
        this.player.eme()
        this.player.src({
          src:
            'https://stream.media.nr.nhk.jp/e3/130/mp4cbcs/2021021400805/master.m3u8',
          type: 'video/mp4',
          keySystems: {
            'com.apple.fps.1_0': {
              certificateUri: 'https://license.media.nr.nhk.jp/fps/cert',
              licenseUri: 'https://license.media.nr.nhk.jp/fps/getLicense',
            },
          },
        })
      }
    )
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose()
    }
  },
}
</script>
