<template>
  <div class="section">
    <div class="columns is-multiline">
      <div class="column">
        <p class="title">Compute Hash</p>
      </div>

      <div class="column is-narrow">
        <button class="button is-light is-danger is-fullwidth" @click="reset">
          Reset
        </button>
      </div>
    </div>

    <div class="box">
      <label>
        Enter your data

        <textarea
          v-model="input"
          type="text"
          class="textarea"
          placeholder="Whatever data you want to hash"
        ></textarea>
      </label>
    </div>

    <div class="box">
      Hash: <code style="word-wrap: break-word">{{ hash }}</code>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import sha256 from "crypto-js/sha256";

export default defineComponent({
  name: "Hash",

  data() {
    return {
      input: "",
      hash: "",
    };
  },

  watch: {
    // Watcher to call updateHash on input change
    input() {
      this.updateHash();
    },
  },

  // Run updateHash on created so to show the hash of the empty input
  created() {
    this.updateHash();
  },

  methods: {
    updateHash() {
      this.hash = sha256(this.input).toString();
    },

    reset() {
      this.input = "";
    },
  },
});
</script>
