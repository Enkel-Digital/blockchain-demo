<template>
  <div class="box">
    <p class="title is-4 mb-1">Signature Created</p>

    <!-- @todo Wrap this in copy on click -->
    <div class="mb-2">
      <code class="word-wrap">{{ signature }}</code>
    </div>

    <p>
      This signature is created by signing the input using the secret / private
      key and can only be verified with the corresponding public key.
    </p>

    <details class="content mt-4">
      <summary style="cursor: pointer">More info</summary>
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
    updateSignature() {
      // Get private key from parent
      const key = EC.keyFromPrivate(this.secretKey);

      this.signature = key
        .sign(this.input)
        .toDER()
        .map((byte: number) => ("0" + (byte & 0xff).toString(16)).slice(-2))
        .join("");

      // Alternative using a utility function
      // Ref: https://stackoverflow.com/questions/34309988/byte-array-to-hex-string-conversion-in-javascript
      // const byteArrayToHexString = (byteArray: number[]) =>
      //   byteArray
      //     .map((byte: number) => ("0" + (byte & 0xff).toString(16)).slice(-2))
      //     .join("");
      // this.signature = byteArrayToHexString(key.sign(this.input).toDER());
    },
  },
});
</script>
