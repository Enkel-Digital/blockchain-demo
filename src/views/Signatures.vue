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
      <div class="columns is-multiline">
        <div class="column is-full">
          <p class="title">Digital Signatures</p>
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

        <div class="column is-full">
          <hr />
        </div>

        <div class="column">
          <p class="title">Generate Keys</p>
        </div>

        <div class="column is-narrow">
          <button
            class="button is-success is-light is-fullwidth"
            @click="generateKeys"
          >
            Generate
          </button>
        </div>

        <div v-if="secretKey && publicKey" class="column is-full">
          <div class="box">
            Private Key:
            <code class="word-wrap">{{ secretKey }}</code>
            <br />

            Public Key:
            <code class="word-wrap">{{ publicKey }}</code>
          </div>
        </div>

        <div v-else class="column is-full">
          Click generate to create a new secret/public key pair.
        </div>
      </div>
    </div>

    <hr />

    <!--
      Dynamic component used based on the tab selected
      Reference: https://vuejs.org/guide/essentials/component-basics.html#dynamic-components
    -->
    <component :is="tab" />
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
    tab: "SignatureCreate" | "SignatureVerify";

    publicKey?: string;
    secretKey?: string;
  } {
    // Default to show create Signature tab
    return {
      tab: "SignatureCreate",

      publicKey: undefined,
      secretKey: undefined,
    };
  },

  methods: {
    generateKeys() {
      // Generate keys
      const key = EC.genKeyPair();
      this.publicKey = key.getPublic().encode("hex", true); // Regardless if compact or not same results
      this.secretKey = key.getPrivate().toString("hex");
    },
  },
});
</script>
