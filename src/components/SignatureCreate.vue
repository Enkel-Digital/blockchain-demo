<template>
  <div class="box">
    <p class="title is-4 mb-1">Signature</p>
    <p>
      The content is signed using the secret / private key, and can only be
      verified with the corresponding public key.
    </p>

    Signature: <code class="word-wrap">{{ signature }}</code>

    <details class="content mt-4">
      <summary style="cursor: pointer">Signatures</summary>
      <ul>
        <li>Signing is something build on Asymmetric Cryptography</li>
        <li>
          A signature may look like a Hash function's output but it is
          different. Because a hash function is a one-way function and so its
          output cannot be reversed back into its input!
        </li>
        <li>
          The digital signature algorithm used here is <code>Secp256k1</code>,
          which is the algorithm (elliptic curve) used by Bitcoin and Ethereum
          to implement its public key cryptography
        </li>
      </ul>
    </details>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { ec } from "elliptic";

// Create and initialize EC context (better do it once and reuse it)
const EC = new ec("secp256k1");

export default defineComponent({
  name: "Signatures",

  props: {
    secretKey: {
      type: String,
      required: true,
    },
    input: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      signature: "",
    };
  },

  watch: {
    // Watcher to call updateSignature on input change
    input() {
      this.updateSignature();
    },
  },

  // Run updateSignature on created so to show the signature of the empty input
  created() {
    this.updateSignature();
  },

  methods: {
    async updateSignature() {
      // Output length config is required because the default length for the SHA3 function is 512bits
      // So this is needed to set to use sha3-256, and the sha256 function will simply ignore this extra config object.
      this.signature = this.input;
    },
  },
});
</script>
