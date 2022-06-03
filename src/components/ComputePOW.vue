<template>
  <div class="section">
    <div class="columns is-multiline">
      <div class="column">
        <p class="title">Compute Proof of Work</p>
      </div>

      <div class="column is-narrow">
        <button class="button is-light is-danger is-fullwidth" @click="reset">
          Reset
        </button>
      </div>
    </div>

    <div class="box">
      <label>
        Set a difficulty level (How many starting zeros)

        <input
          v-model="difficulty"
          type="number"
          class="input"
          placeholder="Difficulty level"
          :disabled="startCompute"
          @keypress.enter="compute"
        />
      </label>
    </div>

    <!-- @todo dynamically calculate and show the difficulty level in terms of probabilities? -->

    <div class="box">
      <label>
        Enter your data

        <textarea
          v-model="blockData"
          class="textarea"
          placeholder="Whatever data you want in your block"
          :disabled="startCompute"
        ></textarea>
      </label>
    </div>

    <div class="box">
      <div class="columns is-vcentered">
        <div class="column"><p class="title">Results</p></div>

        <div class="column is-narrow">
          <div class="select is-success">
            <select v-model="compute_type" :disabled="startCompute">
              <!-- Set compute_type to empty string if using an empty default -->
              <!-- <option disabled value="">Please select one</option> -->
              <option value="nb-main">
                Non Blocking (runs on Main Thread)
              </option>
              <option value="nb-worker">
                Non Blocking (runs on Web Worker)
              </option>
              <option value="blocking">Blocking (runs on Main Thread)</option>
            </select>
          </div>
        </div>

        <div class="column is-narrow">
          <button
            class="button is-light is-success is-fullwidth"
            @click="compute"
          >
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

// Move initial state into its own function to use when resetting component state.
const initialState = () =>
  ({
    difficulty: 3,
    blockData: "",

    compute_type: "nb-main",
    startCompute: undefined,
  } as {
    difficulty: number;
    blockData: string;

    compute_type: "nb-main" | "nb-worker" | "blocking";
    startCompute?: boolean;
  });

export default defineComponent({
  name: "ComputePOW",

  components: {
    "nb-main": POW_NonBlockingMain,
    "nb-worker": POW_NonBlockingWorker,
    blocking: POW_Blocking,
  },

  data: initialState,

  watch: {
    compute_type() {
      // Set startCompute to undefined everytime a new compute type is selected, so that the selected
      // POW component will show its initial UI instead of showing the POW of 0 and hash of ""
      this.startCompute = undefined;
    },
  },

  methods: {
    // Method to set startCompute to true, to trigger the selected
    // POW component to start computing the POW number.
    compute() {
      // Setting this to true will also cause all the inputs to be disabled,
      // so that users cannot modify the input while the POW is being computed.
      this.startCompute = true;
    },

    reset() {
      Object.assign(this.$data, initialState());
    },
  },
});
</script>
