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
                <li>
                  Either click generate to create a new secret/public key pair
                  for this demo
                </li>
                <li>Or, click input to enter your own key pair</li>
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
              <div class="field has-addons">
                <div class="control is-expanded">
                  <input
                    v-model="secretKey"
                    type="text"
                    class="input"
                    placeholder="Secret Key"
                  />
                </div>
                <div class="control">
                  <button class="button is-info">Use</button>
                </div>
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

        <div class="column is-full">
          <div class="box">
            <label>
              <p class="subtitle mb-2">Enter your data</p>

              <textarea
                v-model="input"
                class="textarea"
                placeholder="Whatever data you want to sign or verify"
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
        <div
          v-if="tab === 'SignatureCreate' || tab === 'SignatureVerify'"
          class="column is-full"
        >
          <!--
            Dynamic component used based on the tab selected
            Reference: https://vuejs.org/guide/essentials/component-basics.html#dynamic-components
          -->
          <!-- @todo Pass in the values as props -->
          <component :is="tab" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import SignatureCreate from "../components/SignatureCreate.vue";
import SignatureVerify from "../components/SignatureCreate.vue";

import { ec } from "elliptic";

// Create and initialize EC context (better do it once and reuse it)
const EC = new ec("secp256k1");

export default defineComponent({
  name: "Signatures",

  components: { SignatureCreate, SignatureVerify },

  data(): {
    tab?: "SignatureCreate" | "SignatureVerify";

    inputKeys?: boolean;
    publicKey?: string;
    secretKey?: string;

    input: string;
  } {
    // Default to show create Signature tab
    return {
      // Defaults to undefined so that the UI shows neither
      tab: undefined,

      // Defaults to undefined so that the UI shows neither
      inputKeys: undefined,

      publicKey: undefined,
      secretKey: undefined,

      input: "",
    };
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
