<template>
  <factor-modal :vis.sync="vis">
    <div class="header">
      <h2 class="title">{{ title }}</h2>
      <div class="sub-title">{{ subTitle }}</div>
    </div>

    <template v-if="callback">
      <factor-btn btn="default" @click="vis = false">Cancel</factor-btn>
      <factor-btn btn="primary" :loading="sending" @click="run()">
        {{
          actionText
        }}
      </factor-btn>
    </template>
    <template v-else>
      <factor-btn btn="primary" @click="vis = false">Close</factor-btn>
    </template>
  </factor-modal>
</template>

<script lang="ts">
import { factorBtn, factorModal } from "@factor/ui"
import { onEvent } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: { factorBtn, factorModal },
  data() {
    return {
      vis: false,
      title: "",
      subTitle: "",
      callback: () => {},
      actionText: "",
      sending: false
    }
  },
  mounted() {
    onEvent("dialog", ({ title, message = "", callback = false, actionText = "Go" }) => {
      this.title = title
      this.subTitle = message
      this.callback = callback
      this.actionText = actionText
      this.vis = true
    })
  },
  methods: {
    async run() {


      this.sending = true
      await this.callback.call()
      this.sending = false
      this.vis = false
    }
  }
})
</script>
