<template>
  <v-col cols="12" class="py-0">
    <div class="genre-title">シリーズジャンル</div>
    <div style="display: block">
      <div style="display: inline-block">
        <div style="font-size: 8px">フォーマット</div>
        <div
          v-for="seriesFormatGenre in seriesFormatGenres"
          :key="`sereis-format-genre-${seriesFormatGenre.id}`"
          class="genre-badge series-format-genre-badge"
        >
          {{ seriesFormatGenre.name }}
        </div>
        <div v-if="seriesFormatGenres.length === 0" class="genre-badge" />
      </div>
      /
      <div style="display: inline-block">
        <div style="font-size: 8px">テーマ</div>
        <div
          v-for="seriesThemeGenre in seriesThemeGenres"
          :key="`sereis-theme-genre-${seriesThemeGenre.id}`"
          class="genre-badge series-theme-genre-badge"
        >
          {{ seriesThemeGenre.name }}
        </div>
        <div v-if="seriesThemeGenres.length === 0" class="genre-badge" />
      </div>
    </div>
    <div class="genre-title">エピソードジャンル</div>
    <div style="display: block">
      <div style="display: inline-block">
        <div style="font-size: 8px">フォーマット</div>
        <div
          v-for="episodeFormatGenre in episodeFormatGenres"
          :key="`episode-format-genre-${episodeFormatGenre.id}`"
          class="genre-badge episode-format-genre-badge"
        >
          {{ episodeFormatGenre.name }}
        </div>
        <div v-if="episodeFormatGenres.length === 0" class="genre-badge" />
      </div>
      /
      <div style="display: inline-block">
        <div style="font-size: 8px">テーマ</div>
        <div
          v-for="episodeThemeGenre in episodeThemeGenres"
          :key="`episode-theme-genre-${episodeThemeGenre.id}`"
          class="genre-badge episode-theme-genre-badge"
        >
          {{ episodeThemeGenre.name }}
        </div>
        <div v-if="episodeThemeGenres.length === 0" class="genre-badge" />
      </div>
      <div class="genre-title" :class="{ 'mb-5': hasNoBroadcastGenres }">
        ブロードキャストジャンル
      </div>
      <div
        v-for="broadcastGenre in broadcastGenres"
        :key="`broadcast-genre-${broadcastGenre.id}`"
        class="genre-badge broadcast-genre-badge"
      >
        {{ broadcastGenre.name }}
      </div>
    </div>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    episode: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  computed: {
    seriesFormatGenres(): object[] {
      return this.episode?.partOfSeries?.identifierGroup?.formatGenre || []
    },
    seriesThemeGenres(): object[] {
      return this.episode?.partOfSeries?.identifierGroup?.themeGenre || []
    },
    episodeFormatGenres(): object[] {
      return this.episode?.identifierGroup?.formatGenreTag || []
    },
    episodeThemeGenres(): object[] {
      return this.episode?.identifierGroup?.themeGenreTag || []
    },
    broadcastGenres(): object[] {
      const broadcastEvent = this.episode?.broadcastEvent[0]
      if (broadcastEvent === undefined) return []

      const genres = broadcastEvent.identifierGroup.genres

      return genres.map((item: any) => {
        return { id: item.id, name: item.name1 + '/' + item.name2 }
      })
    },
    hasNoBroadcastGenres(): boolean {
      return this.broadcastGenres.length === 0
    },
  },
})
</script>

<style lang="scss" scoped>
.genre-title {
  font-size: 13px;
  margin-top: 8px;
  font-weight: bold;
}

.genre-badge {
  display: inline-block;
  font-size: 10px;
  border-radius: 15px;
  color: black;
  font-weight: bold;
  padding: 1px 5px;
  margin-right: 6px;

  &:last-child {
    margin-right: 0;
  }
}

.series-format-genre-badge {
  background-color: #acdce2;
}

.series-theme-genre-badge {
  background-color: white;
  border: 2px solid #acdce2;
}

.episode-format-genre-badge {
  background-color: #fdacaf;
}

.episode-theme-genre-badge {
  background-color: white;
  border: 2px solid #fdacaf;
}

.broadcast-genre-badge {
  background-color: #fedc9b;
  border-radius: 0;
  margin-bottom: 4px;
}
</style>
