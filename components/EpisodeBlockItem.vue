<template>
  <v-card>
    <div class="d-flex flex-no-wrap justify-space-between">
      <div>
        <v-card-title class="text-md-body-1">
          {{ episode.name }}
        </v-card-title>
        <v-card-subtitle>
          {{ truncate(episode.description, 40) }}
        </v-card-subtitle>
      </div>
      <v-avatar class="ma-3" size="80" tile>
        <v-img :src="eyecatchUrl(episode.eyecatch)" />
      </v-avatar>
    </div>
    <v-card-actions>
      <v-btn text @click="addEpisodeBlock">
        エピソード追加
      </v-btn>
      <v-spacer />
      <v-btn text @click="show = !show">
        <span>その他</span>
        <v-icon>
          {{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
        </v-icon>
      </v-btn>
    </v-card-actions>
    <v-expand-transition>
      <div v-show="show">
        <v-divider />
        <v-list subheader>
          <v-subheader>別タイプのアイテム</v-subheader>
          <v-list-item
            v-for="(otherTypeItem, i) in otherTypeItems"
            :key="i"
            @click="addOtherTypeBlock(otherTypeItem.type)"
          >
            <v-list-item-icon>
              <v-icon v-text="otherTypeItem.icon" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="otherTypeItem.text" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import sampleEventData from '~/assets/json/event_LR3P5RJ389.json'
import sampleHowToData from '~/assets/json/howTo_G9218G45GJ.json'
import sampleRecipeData from '~/assets/json/recipe.json'

interface DataType {
  show: boolean
  otherTypeItems: Array<Object>
}

export default Vue.extend({
  name: 'EpisodeBlockItem',
  props: {
    episode: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data(): DataType {
    return {
      show: false,
      otherTypeItems: [
        {
          text: '「新ごぼうで和おかず 新ごぼうのフレッシュきんぴら」',
          icon: 'mdi-silverware-fork-knife',
          type: 'recipe',
        },
        {
          text: '2020年5月13日 - あわ怪人をやっつけよう',
          icon: 'mdi-calendar-month',
          type: 'event',
        },
        {
          text: 'アイスが溶けそう～！myボトルマーカーの作り方',
          icon: 'mdi-hammer-wrench',
          type: 'howto',
        },
      ],
    }
  },
  methods: {
    truncate(str: string, len: number) {
      return str.length <= len ? str : str.substr(0, len) + '...'
    },
    eyecatchUrl(eyecatch: any) {
      if (eyecatch !== undefined) {
        return eyecatch.medium.url
      } else {
        return ''
      }
    },
    hoge() {
      // do nothing
    },
    addEpisodeBlock() {
      this.$emit('add-block', {
        type: 'episode',
        data: {
          url: this.episode.url,
          episode: this.episode,
        },
      })
    },
    addOtherTypeBlock(type: string) {
      switch (type) {
        case 'recipe':
          this.$emit('add-block', {
            type: 'recipe',
            data: sampleRecipeData,
          })
          break
        case 'event':
          this.$emit('add-block', {
            type: 'tvEvent',
            data: sampleEventData,
          })
          break
        case 'howto':
          this.$emit('add-block', {
            type: 'howTo',
            data: sampleHowToData,
          })
          break
      }
    },
  },
})
</script>
