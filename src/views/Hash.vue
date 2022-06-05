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
      <div class="columns is-vcentered">
        <div class="column"><p class="subtitle is-4">Hash</p></div>

        <div class="column is-narrow">
          <div class="select is-success is-fullwidth">
            <select v-model="output_type">
              <option value="hex">Hexadecimal</option>
              <option value="bits">Bits</option>
            </select>
          </div>
        </div>

        <div class="column is-narrow">
          <div class="select is-success is-fullwidth">
            <select v-model="hash_function">
              <option value="SHA256">SHA256</option>
              <option value="SHA3">SHA3</option>
            </select>
          </div>
        </div>
      </div>

      <code class="word-wrap">{{ hash }}</code>

      <details class="content mt-4">
        <summary style="cursor: pointer">Types of Hashes</summary>
        <ul>
          <li>
            <b>SHA256</b> is a hash function from the SHA2 hash function family
            with a 256 bit output length.
          </li>
          <li>
            <b>SHA256</b> is one of the most popular hash functions, and is used
            by Bitcoin. This will also be the hash function used for the Proof
            of Work demo later on.
          </li>
          <li>
            <b>SHA3</b> is a hash function from the SHA3 hash function family
            with a 256 bit output length.
          </li>
          <li>
            <b>SHA3</b> is supposed to be more secure than <b>SHA256</b>, and it
            is used by the Ethereum blockchain.
          </li>
        </ul>
      </details>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// Utility function for converting a hexadecimal string to binary as string type.
const hex2bin = (data: string) =>
  data
    .split("")
    .map((i) => parseInt(i, 16).toString(2).padStart(4, "0"))
    .join("");

export default defineComponent({
  name: "Hash",

  data() {
    return {
      output_type: "hex",
      hash_function: "SHA256",

      input: "",
      hash: "",
    };
  },

  watch: {
    // Watcher to call updateHash on input change
    input() {
      this.updateHash();
    },

    // Watcher to call updateHash on change of output type,
    // as updateHash function sets the output
    output_type() {
      this.updateHash();
    },

    // Watcher to call updateHash on change of hash function
    hash_function() {
      this.updateHash();
    },
  },

  // Run updateHash on created so to show the hash of the empty input
  created() {
    this.updateHash();
  },

  methods: {
    /**
     * Caller to await the results to get the hash function lazily
     */
    async getHashFunction() {
      // These es modules have a default export which is the hash function itself,
      // so they are parsed out before returning to the caller.

      switch (this.hash_function) {
        case "SHA256":
          return import("crypto-js/sha256").then(({ default: fn }) => fn);

        case "SHA3":
          return import("crypto-js/sha3").then(({ default: fn }) => fn);

        default: {
          const err = new Error("Invalid hash function selected!");
          alert(err);
          throw err;
        }
      }
    },

    async updateHash() {
      // Lazily load the hash function
      const fn = await this.getHashFunction();

      // Output length config is required because the default length for the SHA3 function is 512bits
      // So this is needed to set to use sha3-256, and the sha256 function will simply ignore this extra config object.
      const hexString = fn(this.input, { outputLength: 256 }).toString();
      this.hash = this.output_type === "hex" ? hexString : hex2bin(hexString);
    },

    reset() {
      this.input = "";
    },
  },
});
</script>
