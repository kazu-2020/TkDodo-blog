<template>
  <div>
    <v-list-item
      v-for="(element, index) in actorsAndContributors"
      :key="`${actorContributorName(element)}-${index}`"
    >
      <v-list-item-icon class="mr-1 my-4">
        <div
          v-if="noActorContributorImage(element)"
          class="actor_contributor_badge"
        >
          <div class="actor_contributor_badge_inner">
            {{ actorContributorName(element).slice(0, 1) }}
          </div>
        </div>
        <v-img
          v-else
          :src="actorContributorImageUrl(element)"
          width="60"
          class="actor_contributor_badge"
        />
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-subtitle v-text="actorContributorRole(element)" />
        <v-list-item-title v-text="actorContributorName(element)" />
        <v-list-item-subtitle
          v-text="actorContributorOccupationName(element)"
        />
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ActorContributorList',
  props: {
    actorsAndContributors: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  methods: {
    actorContributorName(data: any): string {
      return data.person?.name || data.organization?.name || ''
    },
    actorContributorOccupationName(data: any): string {
      return (
        data.person?.occupationName || data.organization?.occupationName || ''
      )
    },
    actorContributorRole(data: any): string {
      const role = data.person?.roleName || data.organization?.roleName || ''
      switch (role) {
        case 'author':
          return '著者'
        case 'copyrightHolder':
          return '著作権者'
        case 'creator':
          return '作家'
        case 'producer':
          return '制作統括者'
        case 'publisher':
          return '出版者'
        case 'funder':
          return '提供者'
        case 'sponsor':
          return 'スポンサー'
        case 'translator':
          return '翻訳者'
        case 'character':
          return 'キャラクター'
        case 'editor':
          return '編集者'
        case 'director':
          return '監督'
        case 'musicBy':
          return 'サウンドトラックの作曲者'
        case 'actor':
          return '出演'
        default:
          return role
      }
    },
    actorContributorImageUrl(data: any): string {
      return (
        data.person?.image?.small?.url ||
        data.organization?.image?.small?.url ||
        ''
      )
    },
    noActorContributorImage(data: any): boolean {
      return this.actorContributorImageUrl(data) === ''
    },
  },
})
</script>

<style lang="scss" scoped>
.actor_contributor_badge {
  border-radius: 30px;
  overflow: hidden;
  display: inline-block;
  margin-right: 10px;
  cursor: pointer;
  background-color: #546e7a;
  width: 60px;
  height: 60px;
  position: relative;

  .actor_contributor_badge_inner {
    display: inline-block;
    position: relative;
    top: 13px;
    left: 20px;
    color: white;
    font-weight: bold;
    font-size: 20px;
  }
}
</style>
