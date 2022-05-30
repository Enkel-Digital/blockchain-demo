<template>
  <!--
    Only show the results section if startCompute has been set to a Boolean before.
    Which means that this will only appear after the user first press compute.
    This will not be shown on page load, where there is no POW and time to show yet.
  -->
  <div v-if="startCompute !== undefined">
    POW: <code>{{ pow }}</code>
    <br />

    <div v-if="time">
      Time taken in seconds: <code>{{ (time / 1000).toFixed(2) }}</code>
      <br />
    </div>

    <div v-if="hash">
      <!-- Word wrap added as this will be quite long and will overflow on mobile -->
      Final hash: <code style="word-wrap: break-word">{{ hash }}</code>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import sha256 from "crypto-js/sha256";

export default defineComponent({
  name: "NonBlockingMain",

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
      // Time it took to calculate the POW number in milliseconds
      time: 0,
      startTime: 0,
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
     * Compute results on the main UI thread without blocking UI updates
     * by queuing each computation results at the end of the events loop
     */
    compute() {
      // Reset the pow and hash
      this.pow = 0;
      this.hash = "";
      this.time = 0;

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
          this.hash = hash;

          this.$emit("compute-done");
        }
      };

      // Get start time to compute time of hashing later
      // Only set this right before first call to the inner function to make time as accurate as possible
      this.startTime = performance.now();

      inner();
    },
  },
});
</script>
