<template>
  <div class="arrow-steps clearfix row no-gutters pr-5">
    <div v-show="showListStep" class="col-4">
      <div
        class="step list-step d-flex justify-center align-center"
        :class="{ current: isList }"
        @click="changeTab('list')"
      >
        <span v-if="hasUnsavedList" class="unsaved-change">●</span>
        <span>リスト (NItemList)</span>
      </div>
    </div>
    <div v-show="showArticleStep" class="col-4">
      <div
        class="step article-step d-flex justify-center align-center"
        :class="{ current: isArticle }"
        @click="changeTab('article')"
      >
        <span v-if="!articleTabValidation" class="has-error">●</span>
        <span v-else-if="hasUnsavedArticle" class="unsaved-change">●</span>
        <span>記事 (NArticle)</span>
      </div>
    </div>
    <div class="col-4">
      <div
        class="step series-step d-flex justify-center align-center"
        :class="{ current: isSeries }"
        @click="changeTab('series')"
      >
        <span
          v-if="!seriesTabValidation || !isUploadedAllImages"
          class="has-error"
          >●</span
        >
        <span v-else-if="hasUnsavedSeries" class="unsaved-change">●</span>
        <span>基本情報(NSeries)</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { PlaylistTab } from '~/models/definitions'

export default Vue.extend({
  name: 'PlaylistStepper',
  props: {
    current: {
      type: String as PropType<PlaylistTab>,
      default: PlaylistTab.list,
      required: false,
    },
    hasUnsavedList: {
      type: Boolean,
      default: false,
      required: true,
    },
    hasUnsavedArticle: {
      type: Boolean,
      default: false,
      required: true,
    },
    hasUnsavedSeries: {
      type: Boolean,
      default: false,
      required: true,
    },
    articleTabValidation: {
      type: Boolean,
      default: true,
      required: true,
    },
    seriesTabValidation: {
      type: Boolean,
      default: true,
      required: true,
    },
    hideListStep: {
      type: Boolean,
      default: false,
      required: false,
    },
    hideArticleStep: {
      type: Boolean,
      default: false,
      required: false,
    },
    isUploadedAllImages: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  computed: {
    isList() {
      return this.current === PlaylistTab.list
    },
    isArticle() {
      return this.current === PlaylistTab.article
    },
    isSeries() {
      return this.current === PlaylistTab.series
    },
    showListStep() {
      return !this.hideListStep
    },
    showArticleStep() {
      return !this.hideArticleStep
    },
  },
  methods: {
    changeTab(nextTab: PlaylistTab) {
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
