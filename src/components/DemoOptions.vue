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
          <button class="button is-light is-success" @click="compute">
            Compute
          </button>
        </div>
      </div>

      <div v-if="loading" class="mt-5">Loading...</div>

      <div v-else class="mt-5">
        Time taken in seconds: <code>{{ time }}</code>
        <br />

        POW: <code>{{ pow }}</code>
        <br />

        <!-- Word wrap added as this will be quite long and will overflow on mobile -->
        Final hash: <code style="word-wrap: break-word">{{ results }}</code>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import sha256 from "crypto-js/sha256";

export default defineComponent({
  name: "DemoOptions",

  data() {
    return {
      difficulty: 3,
      blockData: "",
      loading: false,
      pow: 0,
      results: "",
      time: "", // Time in seconds after converting with toFixed()

      startTime: 0,
    };
  },

  methods: {
    // Method to setup UI before calling the expensive computeResults method
    // As that will block the UI making it hard to load
    compute() {
      // Reset the pow and results
      this.pow = 0;
      this.results = "";
      this.time = "";

      // Set loading UI
      this.loading = true;

      // Get start time to compute time of hashing later
      this.startTime = performance.now();

      // Using setTimeout 0 to queue the blocking computeResults call, after DOM UI has been udpated.
      // Without this, the UI wont show the loading UI before the start of the UI being blocked.
      setTimeout(() => {
        this.computeResults_blocking();
        this.loading = false;
        this.time = ((performance.now() - this.startTime) / 1000).toFixed(2);
      }, 0);
    },

    computeResults_blocking() {
      const leadingZeros = "0".repeat(this.difficulty);

      let hash: string;
      do {
        hash = sha256(this.blockData + this.pow++).toString();
      } while (hash.substring(0, this.difficulty) !== leadingZeros);

      this.results = hash;
    },
  },
});
</script>
