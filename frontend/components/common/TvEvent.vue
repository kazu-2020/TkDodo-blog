<template>
  <div class="article-tv-event">
    <div class="thumbnail-block">
      <img :src="thumbnailUrl" />
    </div>
    <div class="event-info">
      <div class="event-info-header">
        <img :src="badgeUrl" />
        <div class="series-name" :style="{ color: seriesColor }">
          {{ seriesData.name }}
        </div>
        <div class="episode-name">
          {{ episodeName }}
        </div>
      </div>
      <div class="event-title">
        {{ eventData.name }}
      </div>
      <div class="event-detail">
        <div class="event-date">
          <v-icon class="event-date-icon"> mdi-calendar-check </v-icon>
          {{ eventDate }}
        </div>
        <div class="event-place">
          <v-icon class="event-place-icon"> mdi-map-marker </v-icon>
          {{ location }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import format from 'date-fns/format'
import ja from 'date-fns/locale/ja'
import { TvEventData } from '@/types/tv_event_data'
import { SeriesData } from '@/types/series_data'

export default Vue.extend({
  name: 'TvEvent',
  props: {
    eventData: {
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
      return (this.eventData as TvEventData).image?.medium?.url || ''
    },
    badgeUrl() {
      if ((this.seriesData as SeriesData).episodes === undefined) {
        return ''
      }

      return (
        (this.seriesData as SeriesData).episodes[0]?.detailedRecentEvent
          ?.publishedOn.images?.badgeSmall?.url || ''
      )
    },
    episodeName() {
      if ((this.seriesData as SeriesData).episodes !== undefined) {
        return (this.seriesData as SeriesData).episodes[0].name
      } else {
        return ''
      }
    },
    eventDate() {
      const startDateStr = format(
        new Date(this.eventData.startDate),
        'yyyy年M月d日 hh:mm',
        {
          locale: ja,
        }
      ).toString()

      const endDateStr = format(
        new Date(this.eventData.startDate),
        'M月d日 hh:mm',
        {
          locale: ja,
        }
      ).toString()

      return startDateStr + ' ~ ' + endDateStr
    },
    location() {
      const location = this.eventData.location
      const address = this.eventData.address

      return location + ' (' + address + ')'
    },
    seriesColor() {
      return (this.seriesData as SeriesData).style?.primaryLight || '#000000'
    },
  },
})
</script>

<style scoped lang="scss">
.article-tv-event {
  border-radius: 5px;
  border: 1px solid grey;
  color: #4a4a4a;
  margin: 32px 0;

  .thumbnail-block img {
    width: 100%;
  }

  .event-info {
    padding: 8px 16px 16px;
  }

  .event-info-header {
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

  .event-title {
    font-size: 20px;
    font-weight: bold;
    padding-top: 16px;
  }

  .event-date-icon,
  .event-place-icon {
    color: #4a4a4a;
  }

  .event-detail {
    display: table;
    margin-top: 16px;

    .event-date,
    .event-place {
      display: table-cell;
      vertical-align: middle;
    }

    .event-date {
      padding-right: 16px;
    }
  }
}
</style>
