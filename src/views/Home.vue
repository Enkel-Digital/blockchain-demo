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
    <!--
      Component selector tab is wrapped in a sticky navbar.
      See also the class applied to the html tag in index.html
    -->
    <nav class="navbar is-fixed-top">
      <div class="tabs is-centered">
        <ul>
          <li
            :class="{ 'is-active': tab === 'ComputePOW' }"
            @click="tab = 'ComputePOW'"
          >
            <a>Compute POW</a>
          </li>

          <li
            :class="{ 'is-active': tab === 'VerifyPOW' }"
            @click="tab = 'VerifyPOW'"
          >
            <a>Verify POW</a>
          </li>
        </ul>
      </div>
    </nav>

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
  name: "Home",

  components: { ComputePOW, VerifyPOW },

  data(): {
    tab: "ComputePOW" | "VerifyPOW";
  } {
    // Default to show compute POW tab
    return { tab: "ComputePOW" };
  },
});
</script>
