<template>
  <article class="message is-danger">
    <div class="message-body">
      <p class="subtitle has-text-weight-bold">Warning</p>

      The <i>blocking option</i> selected will make this website unresponsive
      until the POW number is calculated, because the calculation will run on
      the main UI thread, freezing everything else until it is done!
      <br />
      <br />

      Do not be alarmed if the website freezes. Simply close the tab if you
      would like to quit.
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
import sha256 from "crypto-js/sha256";

export default defineComponent({
  name: "Blocking",

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
    /**
     * Compute results on the main UI thread directly, blocking all UI updates
     * making it seems to the user as though the application hang / froze up.
     */
    compute() {
      // Set loading UI first as UI will freeze
      this.loading = true;

      // Reset the pow and hash
      this.pow = 0;
      this.hash = "";
      this.time = 0;

      // Using setTimeout 0 to queue the blocking computation, after DOM UI has been udpated.
      // Without this, the UI wont show the loading UI before the start of the UI being blocked.
      setTimeout(() => {
        const leadingZeros = "0".repeat(this.difficulty);

        // Get start time to compute time of hashing later
        const startTime = performance.now();

        let hash: string;
        do {
          hash = sha256(this.blockData + this.pow++).toString();
        } while (hash.substring(0, this.difficulty) !== leadingZeros);

        this.hash = hash;

        // Calculate time taken right after computation completes before doing anything else
        this.time = performance.now() - startTime;

        this.loading = false;
        this.$emit("compute-done");
      }, 0);
    },
  },
});
</script>
