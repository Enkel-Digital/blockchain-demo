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
      <div class="columns has-text-centered">
        <div class="column is-half">
          <button
            class="button is-light is-fullwidth"
            :class="{ 'is-success': tab === 'ComputePOW' }"
            @click="tab = 'ComputePOW'"
          >
            Compute POW
          </button>
        </div>

        <div class="column is-half">
          <button
            class="button is-light is-fullwidth"
            :class="{ 'is-success': tab === 'VerifyPOW' }"
            @click="tab = 'VerifyPOW'"
          >
            Verify POW
          </button>
        </div>
      </div>
    </div>

    <!--
      Dynamic component used based on the tab selected
      Reference: https://vuejs.org/guide/essentials/component-basics.html#dynamic-components
    -->
    <component :is="tab" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import ComputePOW from "../components/ComputePOW.vue";
import VerifyPOW from "../components/VerifyPOW.vue";

export default defineComponent({
  name: "POW",

  components: { ComputePOW, VerifyPOW },

  data(): {
    tab: "ComputePOW" | "VerifyPOW";
  } {
    // Default to show compute POW tab
    return { tab: "ComputePOW" };
  },
});
</script>
