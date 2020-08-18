<template>
  <div class="article-episode">
    <div class="show-panel">
      <div class="show-panel-inner">
        <div class="show-header-box">
          <div class="show-thumb">
            <img class="lazy" alt="" :src="episodeEyecatchUrl" />
          </div>
          <div class="show-intro-box">
            <h3 class="show-title">
              {{ boxTitle }}
            </h3>
            <div class="show-links">
              <ul>
                <li>
                  <a :href="episodeUrl" title="番組HPのURL">
                    <img
                      src="https://www6.nhk.or.jp/nhkpr/img/hp-post-banner.jpg"
                      alt="番組HPのURL"
                    />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="show-info">
          <h4>放送日</h4>
          <div class="show-info-desc">
            <p>
              <span class="channel-time">{{ releasedDateInfo }}</span>
            </p>
          </div>
        </div>
        <div class="show-info">
          <h4>出演者ほか</h4>
          <p>
            -
          </p>
        </div>
        <div class="show-info">
          <h4>内容</h4>
          <p>
            {{ episode.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'
import { EpisodeData } from '@/types/episode_data'

export default Vue.extend({
  name: 'Episode',
  props: {
    episode: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    boxTitle() {
      const seriesName = (this.episode as EpisodeData)?.partOfSeries?.name || ''
      const episodeName = (this.episode as EpisodeData)?.name || ''

      return seriesName + episodeName
    },
    releasedDateInfo() {
      moment.locale('ja')
      const dateStr = moment(this.episode.detailedRecentEvent.startDate).format(
        'M月D日(ddd)'
      )

      const channel =
        ' [' +
        this.episode.detailedRecentEvent.publishedOn.identifierGroup
          .shortenedDisplayName +
        '] '

      const timeStr = moment(this.episode.detailedRecentEvent.startDate).format(
        'h:m'
      )

      return dateStr + channel + timeStr
    },
    episodeEyecatchUrl() {
      return (
        (this.episode as EpisodeData)?.eyecatch?.medium?.url ||
        'https://placehold.jp/150x150.png'
      )
    },
    episodeUrl() {
      return (this.episode as EpisodeData)?.url
    },
  },
})
</script>

<style scoped lang="scss">
.show-panel {
  width: 100%;
  padding: 10px;
  max-width: 794px;
  margin: 0 auto;

  .show-panel-inner {
    background: #fff;
    border: 1px solid #eee;
    border-left: 4px solid #eee;
    border-bottom: 4px solid #eee;
  }

  .show-header-box {
    display: table;
    background: #fff;
    padding: 0;
    border-bottom: 1px solid #eee;
    width: 100%;
  }

  .show-thumb {
    width: 160px;
    display: table-cell;
    vertical-align: middle;
    background: #f5f5f5;
    padding: 0 4px 0 0;

    img.lazy {
      width: 160px;
    }
  }

  .show-intro-box {
    display: block;
    width: 100%;
    border-bottom: 1px solid #eee;
    padding: 10px;
    background: #f5f5f5;
  }

  .show-title {
    display: table-row;
    vertical-align: bottom;
    color: #333;
    font-size: 20px;
    padding: 0;
    margin: 0 0 10px;
    float: left;
    width: 100%;
    text-align: left;
  }

  .show-links ul {
    list-style: none;
    padding: 0;
    width: 100%;
    margin: 0;
    text-align: left;

    li {
      text-align: center;
      margin: 5px;
      display: inline-block;
      margin-right: 5px;

      a {
        width: 160px;
        display: block;

        img {
          max-width: 160px;
          width: 100%;
        }
      }
    }
  }

  .show-info {
    padding: 0 10px 10px;
    color: #4a4a4a;

    h4 {
      margin: 0;
      margin-top: 5px;
      font-size: 14px;
    }

    p {
      margin: 0;
      margin-top: 5px;
      font-size: 12px;
    }
  }
}
</style>
