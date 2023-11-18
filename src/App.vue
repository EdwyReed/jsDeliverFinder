<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <q-layout>
    <q-header class="bg-primary row align-center">
      <img alt="Vue logo" class="logo" src="@/assets/logo.png" width="50" height="50" />
      <h4 class="text-center">DelivrFinder</h4>
    </q-header>

    <q-page-container>
      <RouterView />
    </q-page-container>

    <q-footer class="bg-primary row align-center">
      <q-toolbar style="flex-wrap: wrap;">
        <q-toolbar-title>Made by Ivan Petylo</q-toolbar-title>
        <q-btn
            href="https://github.com/EdwyReed/jsDeliverFinder"
            borderless
            no-caps
            flat
            icon="mdi-github"
        >
          https://github.com/EdwyReed/jsDeliverFinder
        </q-btn>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<style lang="scss">
.q-header {

  .logo {
    margin: .3rem 1rem .3rem .3rem;
  }

  h4 {
    font-weight: 900;
    line-height: 1.7;
  }
}
</style>
