<template>
  <v-card class="mx-auto" outlined>
    <v-list-item three-line>
      <v-list-item-avatar tile size="80" color="grey" />
      <v-list-item-content>
        <div class="overline mb-4">
          OVERLINE
        </div>
        <v-list-item-title class="headline mb-1">
          Headline 5
        </v-list-item-title>
        <v-list-item-subtitle>
          Greyhound divisely hello coldly fonwderfully
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
import { Vue } from 'vue-property-decorator'

export default class PlaylistItem extends Vue {}
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
</style>
