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

import POWWorker from "../pow-worker?worker";

export default defineComponent({
  name: "DemoOptions",

  data() {
    return {
      difficulty: 3,
      blockData: "",
      loading: false,

      compute_type: "nb-main",

      pow: 0,
      results: "",

      // Time it took to calculate the POW number in milliseconds
      time: 0,
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
      this.time = 0;

      // Get start time to compute time of hashing later
      this.startTime = performance.now();

      switch (this.compute_type) {
        case "nb-main":
          return this.computeResults_nonBlocking();

        case "nb-worker":
          this.loading = true;

          if (window.Worker) {
            // https://vitejs.dev/guide/features.html#web-workers
            const worker = new POWWorker();

            worker.postMessage({
              blockData: this.blockData,
              difficulty: this.difficulty,
            });

            worker.onmessage = (e) => {
              // Calculate time taken right after computation completes before doing anything else
              this.time = performance.now() - this.startTime;
              this.results = e.data.hash;
              this.pow = e.data.pow;
              this.loading = false;
            };
          } else {
            alert("Your browser doesn't support Web Workers!");
          }

          return;

        case "blocking":
          // Set loading UI first as UI will freeze
          this.loading = true;

          // Using setTimeout 0 to queue the blocking computeResults call, after DOM UI has been udpated.
          // Without this, the UI wont show the loading UI before the start of the UI being blocked.
          return setTimeout(() => {
            this.computeResults_blocking();

            // Calculate time taken right after computation completes before doing anything else
            this.time = performance.now() - this.startTime;

            this.loading = false;
          }, 0);

        default:
          return alert("Internal Error: Invalid compute type selected");
      }
    },

    /**
     * Compute results on the main UI thread directly, blocking all UI updates
     * making it seems to the user as though the application hang / froze up.
     */
    computeResults_blocking() {
      const leadingZeros = "0".repeat(this.difficulty);

      let hash: string;
      do {
        hash = sha256(this.blockData + this.pow++).toString();
      } while (hash.substring(0, this.difficulty) !== leadingZeros);

      this.results = hash;
    },

    /**
     * Compute results on the main UI thread without blocking UI updates
     * by queuing each computation results at the end of the events loop
     */
    computeResults_nonBlocking() {
      const leadingZeros = "0".repeat(this.difficulty);

      // Inner function uses arrow syntax to keep the function's 'this' binding
      const inner = () => {
        let hash: string = sha256(this.blockData + this.pow++).toString();

        if (hash.substring(0, this.difficulty) !== leadingZeros) {
          // Queue a callback to itself once UI updates are completed
          setTimeout(inner, 0);
        } else {
          // Calculate time taken right after computation completes before doing anything else
          this.time = performance.now() - this.startTime;
          this.results = hash;
        }
      };

      inner();
    },
  },
});
</script>
