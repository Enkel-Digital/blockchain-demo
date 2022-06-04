<template>
  <div class="section">
    <div class="columns is-multiline">
      <div class="column">
        <p class="title">Verify Proof of Work</p>
      </div>

      <div class="column is-narrow">
        <button class="button is-light is-danger is-fullwidth">Reset</button>
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
          min="1"
          @keypress.enter="verify"
        />
      </label>
    </div>

    <div class="box">
      <label>
        Enter your data

        <textarea
          v-model="blockData"
          class="textarea"
          placeholder="Whatever data you want in your block"
        ></textarea>
      </label>
    </div>

    <div class="box">
      <label>
        Enter POW number to verify

        <input
          v-model="pow"
          type="number"
          class="input"
          placeholder="POW number"
          @keypress.enter="verify"
        />
      </label>
    </div>

    <div class="box">
      <div class="columns is-vcentered">
        <div class="column"><p class="subtitle">Verify</p></div>

        <div class="column is-narrow">
          <button class="button is-light is-success" @click="verify">
            Verify
          </button>
        </div>
      </div>

      <div v-if="verified !== undefined">
        POW is <code>{{ verified ? "Correct" : "Wrong" }}</code>
        <br />

        Hash: <code>{{ hash }}</code>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import sha256 from "crypto-js/sha256";

export default defineComponent({
  name: "Verify",

  data(): {
    difficulty: number;
    blockData: string;
    pow?: number;
    verified?: boolean;
    hash: string;
  } {
    return {
      difficulty: 3,
      blockData: "",
      pow: undefined,
      verified: undefined,
      hash: "",
    };
  },

  methods: {
    verify() {
      if (!this.pow) return alert("POW number is not entered");

      const leadingZeros = "0".repeat(this.difficulty);

      // @todo Need to -1 because of the ++ used when calculating the POW
      this.hash = sha256(this.blockData + (this.pow - 1)).toString();
      this.verified = this.hash.substring(0, this.difficulty) === leadingZeros;
    },
  },
});
</script>
