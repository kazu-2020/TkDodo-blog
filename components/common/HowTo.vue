<template>
  <div class="article-how-to">
    <div class="thumbnail-block">
      <img :src="thumbnailUrl" />
    </div>
    <div class="how-to-info">
      <div class="how-to-info-header">
        <img :src="badgeUrl" />
        <div class="series-name" :style="{ color: seriesColor }">
          {{ seriesData.name }}
        </div>
        <div class="episode-name">
          {{ episodeName }}
        </div>
      </div>
      <div class="how-to-title">
        {{ howToData.name }}
      </div>
      <div class="how-to-detail">
        <div class="how-to-description">
          {{ howToDescription }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { SeriesData } from '@/types/series_data'
import { EpisodeData } from '@/types/episode_data'
import { HowToData } from '@/types/how_to_data'

export default Vue.extend({
  name: 'HowTo',
  props: {
    howToData: {
      type: Object,
      default: () => {},
    },
    seriesData: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    thumbnailUrl() {
      const images = this.howToData.image || []
      if (images.length) {
        return images[0].thumbnail[0].url
      } else {
        return ''
      }
    },
    badgeUrl() {
      if ((this.seriesData as SeriesData).episodes === undefined) {
        return ''
      }

      return (
        ((this.seriesData as SeriesData).episodes[0] as EpisodeData)
          .detailedRecentEvent?.publishedOn.images?.badgeSmall?.url || ''
      )
    },
    episodeName() {
      if ((this.seriesData as SeriesData).episodes !== undefined) {
        return ((this.seriesData as SeriesData).episodes[0] as EpisodeData).name
      } else {
        return ''
      }
    },
    howToDescription() {
      return (this.howToData as HowToData).description
    },
    seriesColor() {
      return (this.seriesData as SeriesData).style?.primaryLight || '#000000'
    },
  },
})
</script>

<style lang="scss" scoped>
.article-how-to {
  border-radius: 5px;
  border: 1px solid grey;
  color: #4a4a4a;
  margin: 32px 0;

  .thumbnail-block img {
    width: 100%;
  }

  .how-to-info {
    padding: 8px 16px 16px;
  }

  .how-to-info-header {
    display: table;

    img,
    .series-name,
    .episode-name {
      display: table-cell;
      vertical-align: middle;
    }

    img {
      width: 50px;
      margin-right: 16px;
    }

    .series-name {
      padding-right: 16px;
      font-weight: bold;
    }
  }

  .how-to-title {
    font-size: 20px;
    font-weight: bold;
    padding-top: 16px;
  }

  .how-to-detail {
    display: table;
    margin-top: 16px;

    .how-to-description {
      display: table-cell;
      vertical-align: middle;
      padding-right: 16px;
    }
  }
}
</style>
