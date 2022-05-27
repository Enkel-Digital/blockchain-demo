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
    <Demo>
      <template #title>
        <p class="title">Blockchain Demo</p>
      </template>
    </Demo>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import ComputePOW from "../components/ComputePOW.vue";

export default defineComponent({
  name: "Home",

  components: { Demo },
});
</script>
