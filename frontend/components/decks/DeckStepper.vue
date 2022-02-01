<template>
  <div class="arrow-steps clearfix row no-gutters pr-5">
    <div class="col-4">
      <div
        class="step list-step d-flex justify-center align-center"
        :class="{ current: isPlaylists }"
        @click="changeTab('playlists')"
      >
        <span v-if="hasUnsavedPlaylists" class="unsaved-change">●</span>
        <span>リスト (playlist)</span>
      </div>
    </div>
    <div class="col-4">
      <div
        class="step series-step d-flex justify-center align-center"
        :class="{ current: isDeck }"
        @click="changeTab('deck')"
      >
        <span v-if="!deckTabValidation" class="has-error">●</span>
        <span v-else-if="hasUnsavedDeck" class="unsaved-change">●</span>
        <span>基本情報(deck)</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { DeckTab } from '~/models/definitions'

export default Vue.extend({
  name: 'DeckStepper',
  props: {
    current: {
      type: String as PropType<DeckTab>,
      default: DeckTab.playlists,
      required: false,
    },
    hasUnsavedPlaylists: {
      type: Boolean,
      default: false,
      required: true,
    },
    hasUnsavedDeck: {
      type: Boolean,
      default: false,
      required: true,
    },
    deckTabValidation: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  computed: {
    isPlaylists() {
      return this.current === DeckTab.playlists
    },
    isDeck() {
      return this.current === DeckTab.deck
    },
  },
  methods: {
    changeTab(nextTab: DeckTab) {
      this.$emit('change-tab', nextTab)
    },
  },
})
</script>

<style lang="scss" scoped>
.arrow-steps .step {
  font-size: 18px;
  color: #000;
  cursor: pointer;
  position: relative;
  background-color: white;
  border: 1px solid #cecece;
  height: 52px;
}

.arrow-steps .step:before {
  content: ' ';
  position: absolute;
  top: 0;
  right: -21px;
  width: 0;
  height: 0;
  border-top: 26px solid transparent;
  border-bottom: 25px solid transparent;
  border-left: 19px solid #cecece;
  z-index: 2;
}

.arrow-steps .step:after {
  content: ' ';
  position: absolute;
  top: 0;
  right: -19px;
  width: 0;
  height: 0;
  border-top: 26px solid transparent;
  border-bottom: 25px solid transparent;
  border-left: 19px solid white;
  z-index: 3;
}

.arrow-steps .current.step:after {
  border-left: 19px solid #c6bebb;
}

.arrow-steps .step:last-child {
  border-right: 2px solid #cecece;
}

.arrow-steps .step:last-child:before {
  right: -22px;
  border-top: 26px solid transparent;
  border-bottom: 25px solid transparent;
  border-left: 20px solid #cecece;
}

.arrow-steps .step:last-child:after {
  right: -20px;
  border-top: 26px solid transparent;
  border-bottom: 24px solid transparent;
  border-left: 20px solid white;
}

.arrow-steps .current.step:last-child:after {
  border-left: 20px solid #c6bebb;
}

.arrow-steps .step span {
  position: relative;
}

.arrow-steps .step span:before {
  opacity: 0;
  content: '✔';
  position: absolute;
  top: -2px;
  left: -20px;
}

.arrow-steps .step.done span:before {
  opacity: 1;
  -webkit-transition: opacity 0.3s ease 0.5s;
  -moz-transition: opacity 0.3s ease 0.5s;
  -ms-transition: opacity 0.3s ease 0.5s;
  transition: opacity 0.3s ease 0.5s;
}

.arrow-steps .step.current {
  color: white;
  background-color: #c6bebb;
  font-weight: bold;
}

.has-error {
  color: #ab0000;
  font-size: 8px;
  position: relative;
  top: -9px;
}

.unsaved-change {
  color: #009688;
  font-size: 8px;
  position: relative;
  top: -9px;
}
</style>
