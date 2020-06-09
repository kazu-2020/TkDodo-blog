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
          {{ seriesData.episodes[0].name }}
        </div>
      </div>
      <div class="event-title">
        {{ eventData.name }}
      </div>
      <div class="event-detail">
        <div class="event-date">
          <v-icon class="event-date-icon">
            mdi-calendar-check
          </v-icon>
          {{ eventDate }}
        </div>
        <div class="event-place">
          <v-icon class="event-place-icon">
            mdi-map-marker
          </v-icon>
          {{ location }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'

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
      return this.eventData.image.medium.url
    },
    badgeUrl() {
      return this.seriesData.episodes[0].detailedRecentEvent.publishedOn.images
        .badgeSmall.url
    },
    eventDate() {
      moment.locale('ja')

      const startDateStr = moment(this.eventData.startDate).format(
        'YYYY年M月D日 hh:mm'
      )
      const endDateStr = moment(this.eventData.endDate).format('M月D日 hh:mm')

      return startDateStr + ' ~ ' + endDateStr
    },
    location() {
      const location = this.eventData.location
      const address = this.eventData.address

      return location + ' (' + address + ')'
    },
    seriesColor() {
      return this.seriesData.style.primaryLight
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
