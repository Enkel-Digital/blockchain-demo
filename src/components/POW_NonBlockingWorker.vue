<template>
  <article class="message">
    <div class="message-body">
      <p class="subtitle has-text-weight-bold">Note</p>

      The <i>non blocking worker option</i> selected will not show any real time
      updates while the POW number is calculated, because the calculation will
      run on a seperate worker thread to speed things up, and communicating
      updates will negate the speed up.
    </div>
  </article>

  <!--
    Only show the results section if startCompute has been set to a Boolean before.
    Which means that this will only appear after the user first press compute.
    This will not be shown on page load, where there is no POW and time to show yet.
  -->
  <div v-if="startCompute !== undefined">
    <div v-if="loading">Loading...</div>

    <div v-else>
      Time taken in seconds: <code>{{ (time / 1000).toFixed(2) }}</code>
      <br />

      POW: <code>{{ pow }}</code>
      <br />

      <!-- Word wrap added as this will be quite long and will overflow on mobile -->
      Final hash: <code style="word-wrap: break-word">{{ hash }}</code>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import POWWorker from "../pow-worker?worker";

export default defineComponent({
  name: "NonBlockingWorker",

  props: {
    startCompute: {
      type: Boolean,
    },

    difficulty: {
      type: Number,
      required: true,
    },
    blockData: {
      type: String,
      required: true,
    },
  },

  emits: ["compute-done"],

  data() {
    return {
      loading: false,

      // Time it took to calculate the POW number in milliseconds
      time: 0,
      pow: 0,
      hash: "",
    };
  },

  watch: {
    startCompute(start) {
      // Only run compute function if it is set to true.
      // Where parent component setting startCompute to true is used as the trigger to start computation.
      // This component will set startCompute to false once compute completes by emitting an event up.
      if (start) this.compute();
    },
  },

  methods: {
    compute() {
      this.loading = true;

      // Reset the pow and hash
      this.pow = 0;
      this.hash = "";
      this.time = 0;

      // Get start time to compute time of hashing later
      const startTime = performance.now();

      if (window.Worker) {
        // https://vitejs.dev/guide/features.html#web-workers
        const worker = new POWWorker();

        worker.postMessage({
          blockData: this.blockData,
          difficulty: this.difficulty,
        });

        worker.onmessage = (e) => {
          // Calculate time taken right after computation completes before doing anything else
          this.time = performance.now() - startTime;
          this.hash = e.data.hash;
          this.pow = e.data.pow;
          this.loading = false;

          this.$emit("compute-done");
        };
      } else {
        alert("Your browser doesn't support Web Workers!");
      }
    },
  },
});
</script>
