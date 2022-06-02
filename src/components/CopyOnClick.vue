<script setup lang="ts">
import { useStore } from "../store/index";

defineProps({
  showIcon: {
    type: Boolean,
  },
  textToCopy: {
    type: String,
    required: true,
  },
});

const copy = useStore().copy;
</script>

<template>
  <span class="icon-text is-clickable" @click="copy(textToCopy)">
    <slot></slot>
    <img v-if="showIcon" src="/copy-icon.png" />
  </span>
</template>
