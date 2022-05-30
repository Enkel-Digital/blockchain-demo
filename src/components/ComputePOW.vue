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

      <nb-worker
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

import POW_NonBlocking_Worker from "./POW_NonBlockingWorker.vue";

export default defineComponent({
  name: "ComputePOW",

  components: {
    "nb-worker": POW_NonBlocking_Worker,
  },

  data() {
    return {
      difficulty: 3,
      blockData: "",

      compute_type: "nb-main",
      startCompute: false,
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
