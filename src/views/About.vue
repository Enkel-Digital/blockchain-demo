<template>
  <div>
    <div class="columns is-multiline mx-6 my-6">
      <div class="column is-full">
        <p class="title is-3">About</p>
        <br />

        <p class="subtitle">
          This Interactive Blockchain Demo website was created to help everyone
          learning about blockchain technology see and experiment to learn how
          things actually work instead of just reading about it somewhere.
        </p>

        <div class="column is-full">
          <hr />
        </div>

        <p class="subtitle">
          Created by
          <a href="https://github.com/Jaimeloeuf" target="_blank">JJ</a> for
          <a href="https://zca.sg/" target="_blank">Zenith Coding Academy</a>
        </p>

        <div class="column is-full">
          <hr />
        </div>

        <div class="columns is-vcentered">
          <div class="column">
            <p class="subtitle">
              This site is free to use, and its code is open source too on
              Github!
            </p>
          </div>

          <div class="column is-narrow">
            <a
              href="https://github.com/Enkel-Digital/blockchain-demo"
              class="button is-light is-success is-fullwidth"
              target="_blank"
            >
              Github
            </a>
          </div>
        </div>
      </div>

      <div class="column is-full">
        <hr />
      </div>

      <div class="column is-half">
        <button
          class="button is-light is-warning is-fullwidth"
          @click="$router.back"
        >
          Back
        </button>
      </div>

      <div class="column is-half">
        <router-link
          class="button is-light is-success is-fullwidth"
          :to="{ name: 'home' }"
        >
          Home
        </router-link>
      </div>
    </div>
  </div>
</template>
