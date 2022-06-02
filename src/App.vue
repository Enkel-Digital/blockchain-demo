<script setup lang="ts">
import Navbar from "./components/Navbar.vue";

import { useStore } from "./store/index";
const store = useStore();
</script>

<template>
  <!--
    Use a fixed position and apply overlay style so that the notification will
    not take up space on the normal plane and push everything else down.
   -->
  <div
    v-if="store.notif"
    style="position: fixed; top: 1rem; z-index: 100; width: 100%"
  >
    <div class="container">
      <div class="mx-6">
        <!-- Only apply the box shadow to the notification bar itself -->
        <div
          class="notification is-primary is-light"
          style="box-shadow: 0 0.3rem 1rem rgb(0 0 0 / 0.4)"
        >
          <button class="delete" @click="store.clearNotif"></button>

          <!-- Word wrap CSS added to deal with unusually long slugs on small screens -->
          <span style="word-wrap: break-word">{{ store.notifContent }}</span>

          <!-- Alternative allowing HTML content to be shown -->
          <!-- <span style="word-wrap: break-word" v-html="store.notifContent" /> -->
        </div>
      </div>
    </div>
  </div>

  <Navbar />

  <!-- Center router view element horizontally -->
  <!--
    By passing this attribute to child components, the child components
    cannot be a fragment (return multiple root nodes) as vue js will
    not know which node to bind the fallthrough attribute to.

    See reference:
    https://v3-migration.vuejs.org/new/fragments.html#overview
    https://vuejs.org/guide/components/attrs.html#fallthrough-attributes
  -->
  <router-view class="container" />
</template>

<style>
/* Unscoped styles that applies to the entire application */

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/*
  Color input pink if it is invalid --> e.g. when telephone number does not match the specified pattern
  Will only activate if the placeholder is not currently being shown, meaning will not show before user type anything
*/
input:not(:placeholder-shown):invalid {
  background-color: lightpink;
}
</style>
