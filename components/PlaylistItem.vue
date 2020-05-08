<template>
  <v-card class="mb-4" outlined light>
    <v-list-item three-line>
      <v-list-item-avatar tile size="240" color="grey" horizontal />
      <v-list-item-content>
        <v-list-item-title class="headline mb-1">
          {{ playlist.title }}
        </v-list-item-title>
        <v-list-item-subtitle>
          番組数:
          <span>8件</span>
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          公開期間:
          <span>2020/01/02 ~ 2021/10/02</span>
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          番組総時間:
          <span>01:11:59</span>
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          <v-icon>mdi-update</v-icon>
          {{ formattedDate(playlist.updated_at) }}
          更新
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-card-actions>
        <v-btn outlined x-small>
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
        <v-btn outlined x-small>
          <v-icon>mdi-delete-outline</v-icon>
        </v-btn>
      </v-card-actions>
    </v-list-item>
  </v-card>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import moment from 'moment'

@Component
export default class PlaylistItem extends Vue {
  @Prop({ type: Object, required: true })
  playlist?: object

  formattedDate(_time: string) {
    return moment(_time).format('YYYY/MM/DD')
  }
}
</script>
<style>
.v-list-item {
  position: relative;
}

.v-card__actions {
  position: absolute;
  top: 0;
  right: 0;
}

.v-btn:not(.v-btn--round).v-size--x-small {
  min-width: 0;
  width: 35px;
  height: 35px;
}

.v-application--is-ltr
  .v-list-item__avatar.v-list-item__avatar--horizontal:first-child {
  margin-top: 0px;
  margin-left: -16px;
  margin-bottom: 0;
}

.v-avatar.v-list-item__avatar.v-list-item__avatar--horizontal.v-avatar--tile.grey {
  border-top-left-radius: 3px;
  -webkit-border-top-left-radius: 3px;
  -moz-border-radius-topleft: 3px;
  border-bottom-left-radius: 3px;
  -webkit-border-bottom-left-radius: 3px;
  -moz-border-radius-bottomleft: 3px;
}
</style>
