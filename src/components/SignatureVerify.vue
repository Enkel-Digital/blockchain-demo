<template>
  <div class="box">
    <p class="title is-4 mb-1">Signature Verification</p>
    <p>
      Type or paste in the signature below and it will check if your signature
      is valid
    </p>
    <br />

    <input
      v-model="signature"
      type="text"
      class="input"
      :class="{
        'is-success': isSignatureValid,

        // Only show that it is invalid if any signature is entered and is invalid
        'is-danger': signature.length !== 0 && !isSignatureValid,
      }"
      placeholder="Secret Key"
    />

    <!-- Only show this UI if user typed in any signature at all -->
    <span v-if="signature.length !== 0">
      The given signature is
      <span v-if="isSignatureValid">
        <b class="has-text-success">valid</b> for the input above.
      </span>
      <span v-else>
        <b class="has-text-danger">invalid</b> for the input above.
      </span>
    </span>

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
  name: "SignatureVerify",

  props: {
    publicKey: {
      type: String,
      required: true,
    },
    input: {
      type: String,
      required: true,
    },
  },

  data(): {
    signature: string;
    isSignatureValid: boolean;
  } {
    return {
      signature: "",
      isSignatureValid: false,
    };
  },

  watch: {
    // Watcher to call reVerify on input or signature change
    input() {
      this.reVerify();
    },
    signature() {
      this.reVerify();
    },
  },

  methods: {
    reVerify() {
      try {
        // Use public key from parent to verify the signature
        const pkey = EC.keyFromPublic(this.publicKey, "hex");
        this.isSignatureValid = pkey.verify(this.input, this.signature);
      } catch {
        // Since the verify function might throw if the signature is invalid in certain ways,
        // like missing r or s values. Therefore, all errors are treated as invalid signature.
        this.isSignatureValid = false;
      }
    },
  },
});
</script>
