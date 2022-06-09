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
          <p class="title">Digital Signatures</p>
        </div>

        <div class="column is-narrow">
          <button class="button is-light is-danger is-fullwidth" @click="reset">
            Reset
          </button>
        </div>

        <div class="column is-full">
          <div class="box">
            <p class="subtitle mb-0">Keys</p>

            <div class="content">
              <ul>
                <li>A secret/public key pair is needed to run this demo</li>
                <li>
                  Either click generate to create a new secret/public key pair
                  for this demo
                </li>
                <li>Or, click input to enter your own secret key</li>
              </ul>
            </div>

            <div class="columns">
              <div class="column is-half">
                <button
                  class="button is-warning is-light is-fullwidth"
                  @click="useInput"
                >
                  Input
                </button>
              </div>

              <div class="column is-half">
                <button
                  class="button is-success is-light is-fullwidth"
                  @click="generateKeys"
                >
                  Generate
                </button>
              </div>
            </div>

            <!-- @todo Change color just like create/verify sig for the generate and input buttons -->

            <!-- If any of the options are selected, show a divisor -->
            <div v-if="inputKeys !== undefined">
              <hr />
            </div>

            <div v-if="inputKeys === true">
              <label>
                Enter your 64 hexadecimal character secret key, the public key
                will be generated once secret key is entered.

                <input
                  v-model="secretKey"
                  type="text"
                  class="input"
                  placeholder="Secret Key"
                  pattern="[0-9a-fA-F]+$"
                  minlength="64"
                  maxlength="64"
                />
              </label>

              <!--
                Only show this UI if a full private key is entered,
                the secretKey entered is a valid hexadecimal string,
                and the public key has been successfully generated.
              -->
              <div
                v-if="
                  secretKey.length === 64 &&
                  /[0-9a-fA-F]+$/.test(secretKey) &&
                  publicKey !== ''
                "
              >
                <div class="mb-2">
                  Private Key: <code class="word-wrap">{{ secretKey }}</code>
                </div>

                Public Key:
                <code class="word-wrap">{{ publicKey }}</code>
              </div>
            </div>

            <div v-else-if="inputKeys === false">
              <div class="mb-2">
                Private Key: <code class="word-wrap">{{ secretKey }}</code>
              </div>

              Public Key:
              <code class="word-wrap">{{ publicKey }}</code>
            </div>
          </div>
        </div>

        <div class="column is-full">
          <hr />
        </div>

        <div v-if="secretKey && publicKey" class="column is-full">
          <div class="columns is-multiline is-vcentered">
            <div class="column is-full">
              <div class="box">
                <label>
                  <p class="subtitle mb-2">Enter your data</p>

                  <textarea
                    v-model="input"
                    class="textarea"
                    placeholder="Whatever data you want to sign or verify"
                    rows="2"
                  ></textarea>
                </label>
              </div>
            </div>

            <div class="column is-full">
              <hr />
            </div>

            <div class="column is-half">
              <button
                class="button is-light is-fullwidth"
                :class="{ 'is-success': tab === 'SignatureCreate' }"
                @click="tab = 'SignatureCreate'"
              >
                Create Signature
              </button>
            </div>

            <div class="column is-half">
              <button
                class="button is-light is-fullwidth"
                :class="{ 'is-success': tab === 'SignatureVerify' }"
                @click="tab = 'SignatureVerify'"
              >
                Verify Signature
              </button>
            </div>

            <!-- Only show this section once user clicks create or verify signature -->

            <SignatureCreate
              v-if="tab === 'SignatureCreate'"
              :secretKey="secretKey"
              :input="input"
              class="column is-full"
            />

            <SignatureVerify
              v-else-if="tab === 'SignatureVerify'"
              :publicKey="publicKey"
              :input="input"
              class="column is-full"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import SignatureCreate from "../components/SignatureCreate.vue";
import SignatureVerify from "../components/SignatureVerify.vue";

import { ec } from "elliptic";

// Create and initialize EC context (better do it once and reuse it)
const EC = new ec("secp256k1");

export default defineComponent({
  name: "Signatures",

  components: { SignatureCreate, SignatureVerify },

  data(): {
    tab?: "SignatureCreate" | "SignatureVerify";

    inputKeys?: boolean;
    publicKey: string;
    secretKey: string;

    input: string;
  } {
    return {
      // Defaults to undefined so that the UI shows neither
      tab: undefined,

      // Defaults to undefined so that the UI shows neither
      inputKeys: undefined,

      publicKey: "",
      secretKey: "",

      input: "",
    };
  },

  watch: {
    secretKey() {
      // Only call the useKey function if user is entering keys manually
      if (this.inputKeys) this.useKey();
    },
  },

  methods: {
    reset() {
      // Reset all data variables
    },

    useInput() {
      // Set this variable to update the UI to show the input keys UI
      this.inputKeys = true;

      // Reset the key pair in case user generated it before hand
      this.publicKey = "";
      this.secretKey = "";
    },

    useKey() {
      // Do nothing if secretKey input is empty, not 64 characters or not a hexadecimal string.
      if (
        !this.secretKey ||
        this.secretKey.length !== 64 ||
        !/[0-9a-fA-F]+$/.test(this.secretKey)
      )
        return;

      // Generate the public key from the user's secret key input
      const key = EC.keyFromPrivate(this.secretKey);
      this.publicKey = key.getPublic().encode("hex", true); // Regardless if compact or not same results
    },

    generateKeys() {
      // Set this variable to update the UI to stop showing the input keys UI
      this.inputKeys = false;

      // Generate keys
      const key = EC.genKeyPair();
      this.publicKey = key.getPublic().encode("hex", true); // Regardless if compact or not same results
      this.secretKey = key.getPrivate().toString("hex");
    },
  },
});
</script>
