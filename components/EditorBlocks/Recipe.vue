<template>
  <div class="article-recipe">
    <div class="thumbnail-block">
      <img :src="thumbnailUrl" />
    </div>
    <div class="recipe-info">
      <div class="recipe-info-header">
        <img :src="badgeUrl" />
        <div class="series-name" :style="{ color: seriesColor }">
          {{ seriesData.name }}
        </div>
        <div class="episode-name">
          {{ episodeName }}
        </div>
      </div>
      <div class="recipe-title">
        {{ recipeData.name }}
      </div>
      <div class="recipe-detail">
        <div class="recipe-description">
          {{ recipeDescription }}
        </div>
        <div class="recipe-cooking-time">
          <v-icon class="recipe-cooking-time-icon">
            mdi-alarm
          </v-icon>
          <div class="recipe-cooking-time-value">
            {{ cookingTime }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { SeriesData } from '@/types/series_data'
import { RecipeData } from '@/types/recipe_data'

export default Vue.extend({
  name: 'Recipe',
  props: {
    recipeData: {
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
      const images = this.recipeData.image || []
      if (images.length) {
        return images[0]
      } else {
        return ''
      }
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
    recipeDescription() {
      return (this.recipeData as RecipeData).description
    },
    cookingTime() {
      return (
        '調理時間: ' +
        this.recipeData.cookTime.replace('PT', '').replace('M', '分')
      )
    },
    seriesColor() {
      return (this.seriesData as SeriesData).style?.primaryLight || '#000000'
    },
  },
})
</script>

<style lang="scss" scoped>
.article-recipe {
  border-radius: 5px;
  border: 1px solid grey;
  color: #4a4a4a;
  margin: 32px 0;

  .thumbnail-block img {
    width: 100%;
  }

  .recipe-info {
    padding: 8px 16px 16px;
  }

  .recipe-info-header {
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

  .recipe-title {
    font-size: 20px;
    font-weight: bold;
    padding-top: 16px;
  }

  .recipe-cooking-time-icon {
    color: #4a4a4a;
    margin-right: 8px;
    display: inline-block;
  }

  .recipe-detail {
    display: table;
    margin-top: 16px;

    .recipe-description,
    .recipe-cooking-time {
      display: table-cell;
      vertical-align: middle;
    }

    .recipe-description {
      padding-right: 16px;
    }

    .recipe-cooking-time {
      min-width: 144px;
    }

    .recipe-cooking-time-value {
      display: inline-block;
      position: relative;
      top: 3px;
    }
  }
}
</style>
