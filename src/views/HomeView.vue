<template>
  <div class="column items-center">
    <q-input
        class="search-input"
        debounce="500"
        standout
        rounded
        color="secondary"
        bg-color="primary-light"
        v-model="searchQuery"
        label="Type keyword on NPM package name"
    >
      <template v-slot:append>
        <q-icon color="primary" name="search"/>
      </template>
    </q-input>
    <div class="packages-list column items-center justify-between" :class="{loading: loading}">
      <card-package-wide
          class="packages-list__item"
          v-for="item in packages"
          :key="item.package.name"
          :npmPackage="item"
          @select="selectPackage($event)"
          @search="searchQuery = $event"
      />
    </div>
    <q-pagination
        v-if="total_pages > 1"
        color="primary-light"
        text-color="light"
        active-text-color="secondary"
        v-model="page"
        :max="total_pages"
        :max-pages="5"
        direction-links
        gutter="10px"
        outline
        flat
    />
  </div>

  <dialog-package-details
      v-model="isPackageSelected"
      v-if="isPackageSelected"
      :selected-package="selectedPackage"
      @search="searchQuery = $event"
      @close="isPackageSelected = false"
  />
</template>

<script setup lang="ts">
import {computed, type Ref, ref, watch} from "vue";
import {searchNpmPackages} from "@/api/npmApiRepo";
import type {PackageFromSearch} from "@/types";
import DialogPackageDetails from "@/components/DialogPackageDetails.vue";
import CardPackageWide from "@/components/CardPackageWide.vue";

const packages: Ref<PackageFromSearch[]> = ref([]);

const selectedPackage: Ref<PackageFromSearch | null> = ref(null);
const isPackageSelected = ref(false);

const searchQuery = ref("");
const page = ref(1);
const per_page = ref(10);
const total_pages = ref(0);
const loading = ref(true);

const offset = computed(() => {
  return per_page.value * (page.value - 1);
})

watch(searchQuery, async () => {
  total_pages.value = 0;
  page.value = 1;
  await fetchPackages();
})

watch(page, async () => {
  await fetchPackages();
})

const fetchPackages = async () => {
  loading.value = true;
  const result = await searchNpmPackages(searchQuery.value, offset.value, per_page.value);
  total_pages.value = Math.ceil(result.total / per_page.value);
  packages.value = result.objects;
  loading.value = false;
}

const selectPackage = async (pckg: PackageFromSearch) => {
  isPackageSelected.value = true;
  selectedPackage.value = pckg;
}
</script>

<style lang="scss">
@import "@/styles/variables.scss";

.search-input {
  width: 100%;
  max-width: 50rem;
  margin: 2rem 0;

  input {
    color: $primary !important;
  }
}

.packages-list {
  width: 100%;
  padding: 0 3rem;
  row-gap: 1rem;
  filter: blur(0);

  &.loading {
    pointer-events: none;
    filter: blur(3px);
  }
}

.q-pagination {
  margin: 2rem 0;

  .q-btn {
    min-width: 2em !important;
    aspect-ratio: 1;
  }
}

@media (max-width: 50rem) {
  .search-input {
    margin: 0 0 2rem 0;

    .q-field__control {
      border-radius: 0 !important;
    }
  }

  .packages-list {
    padding: 0;

    &__item {
      max-width: 100%;
    }
  }
}
</style>
