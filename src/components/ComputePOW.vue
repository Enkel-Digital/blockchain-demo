<template>
  <div class="section">
    <!-- Named slot, see usage in Home.vue -->
    <slot name="title"></slot>

    <div class="box m-3">
      <label>
        Set a difficulty level (How many starting zeros)

        <input
          v-model="difficulty"
          type="number"
          class="input"
          placeholder="Difficulty level"
          @keypress.enter="compute"
        />
      </label>
    </div>

    <div class="box m-3">
      <label>
        Enter your data

        <input
          v-model="blockData"
          type="text"
          class="input"
          placeholder="Whatever data you want in your block"
          @keypress.enter="compute"
        />
      </label>
    </div>

    <div class="box m-3">
      <div class="columns is-vcentered">
        <div class="column"><p class="title">Results</p></div>

        <div class="column is-narrow">
          <div class="select is-success">
            <select v-model="compute_type">
              <!-- Set compute_type to empty string if using an empty default -->
              <!-- <option disabled value="">Please select one</option> -->
              <option value="nb-main">
                Non Blocking (runs on Main Thread)
              </option>
              <option value="nb-worker">
                Non Blocking (runs on Web Worker)
              </option>
              <option value="blocking">Blocking</option>
            </select>
          </div>
        </div>

        <div class="column is-narrow">
          <button class="button is-light is-success" @click="compute">
            Compute
          </button>
        </div>
      </div>

      <!--
        Dynamic component used based on the tab selected
        Reference: https://vuejs.org/guide/essentials/component-basics.html#dynamic-components

        This is not recommended to use especially when using TypeScript,
        because there is no prop type validation for dynamic components.
        However, it is ok in this case because all the components take the exact same props.
      -->
      <component
        :is="compute_type"
        class="mt-5"
        :difficulty="difficulty"
        :blockData="blockData"
        :startCompute="startCompute"
        @compute-done="startCompute = false"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import POW_NonBlockingMain from "./POW_NonBlockingMain.vue";
import POW_NonBlockingWorker from "./POW_NonBlockingWorker.vue";
import POW_Blocking from "./POW_Blocking.vue";

export default defineComponent({
  name: "ComputePOW",

  components: {
    "nb-main": POW_NonBlockingMain,
    "nb-worker": POW_NonBlockingWorker,
    blocking: POW_Blocking,
  },

  data() {
    return {
      difficulty: 3,
      blockData: "",

      compute_type: "nb-main",
      startCompute: undefined,
    };
  },

  methods: {
    compute() {
      // @todo Disable input while loading
      this.startCompute = true;
    },
  },
});
</script>
