<template>
  <!--
    Wrapping all elements of this view in a div even though vue3 allows
    for multiple elements per template without a root element.
    However, since there is a class applied to the router-view element
    in App.vue, vue will not know which sub element to apply that class
    onto, therefore, by grouping all under a div tag, the class applied
    on router-view element in App.vue will be inherited here on this div.
  -->
  <div>
    <!-- Overriding section class's y axis padding to stay consistent with the different POW components -->
    <div class="section py-0">
      <div class="columns is-multiline is-vcentered">
        <div class="column">
          <p class="title">Verify Signature</p>
        </div>

        <div class="column is-narrow">
          <button class="button is-light is-danger is-fullwidth" @click="reset">
            Reset
          </button>
        </div>

        <div class="column is-full">
          <div class="box">
            <p class="subtitle mb-0">Instructions</p>

            <div class="content">
              <ul>
                <li>
                  Enter a message and signature to verify if it is signed by the
                  corresponding private key of the given public key!
                </li>
                <li>
                  Once verified, you know that the message is authentic and
                  actually came from the person who owns the corresponding
                  private key to the given public key.
                </li>
              </ul>
            </div>

            <hr />

            <label>
              Enter a public key in hexadecimal

              <input
                v-model="publicKey"
                type="text"
                class="input"
                placeholder="Public Key"
                pattern="[0-9a-fA-F]+$"
              />
            </label>
            <br />
            <br />

            <label>
              Enter your data

              <textarea
                v-model="input"
                class="textarea"
                placeholder="Whatever data you want to sign or verify"
                rows="2"
              ></textarea>
            </label>
            <br />

            <label>
              Enter the signature you received for the input in hexadecimal

              <input
                v-model="signature"
                type="text"
                class="input"
                placeholder="Signature"
                pattern="[0-9a-fA-F]+$"
              />
            </label>
          </div>
        </div>

        <!--
          Only show the verification results once public key and signature are entered.
          Input can be blank for empty messages.
        -->
        <div v-if="publicKey !== '' && signature !== ''" class="column is-full">
          <div class="box">
            Signature is:
            <span v-if="isSignatureValid" class="has-text-success-dark">
              Valid
            </span>
            <span v-else class="has-text-danger-dark">Invalid</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ec } from "elliptic";

// Create and initialize EC context (better do it once and reuse it)
const EC = new ec("secp256k1");

const initialState = (): {
  publicKey: string;
  input: string;
  signature: string;

  isSignatureValid: boolean;
} => ({
  publicKey: "",
  input: "",
  signature: "",

  isSignatureValid: false,
});

export default defineComponent({
  name: "VerifySignature",

  data: initialState,

  watch: {
    publicKey() {
      this.reVerify();
    },
    input() {
      this.reVerify();
    },
    signature() {
      this.reVerify();
    },
  },

  methods: {
    reset() {
      Object.assign(this.$data, initialState());
    },

    reVerify() {
      try {
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
