<template>
  <!--
    Wrapping all elements of this view in a div even though vue3 allows
    for multiple elements per template without a root element.
    However, since there is a class applied to the router-view element
    in App.vue, vue will not know which sub element to apply that class
    onto, therefore, by grouping all under a div tag, the class applied
    on router-view element in App.vue will be inherited here on this div.
  -->
  <div style="max-width: 46em">
    <!-- Show a bunch of links in home page like hazmatrix to try out each of the examples -->

    <router-link
      class="button is-light is-success is-fullwidth is-large"
      :to="{ name: 'pow' }"
    >
      Proof of Work
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Home",
});
</script>
