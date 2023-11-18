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
      <q-card class="packages-list__item column q-pa-sm" flat v-for="item in packages" :key="item.package.name">
        <div class="package-main-info row no-wrap full-width items-start">
          <div class="row">
            <q-chip clickable @click="selectPackage(item)">
              {{ item.package.name }}
              <q-tooltip :delay="500" :offset="[0, 10]">{{ item.package.description }}</q-tooltip>
            </q-chip>
            <q-badge align="middle" color="blue-5" outline>
              v. {{ item.package.version }}
            </q-badge>
          </div>
          <q-space/>
          <q-btn-group class="package-links" flat outline color="blue-9">
            <q-btn :href="item.package.links.npm" target="_blank" outline text-color="blue-9" dense icon="mdi-npm"/>
            <q-btn :href="item.package.links.repository" target="_blank" outline text-color="blue-9" dense
                   icon="mdi-git"/>
            <q-btn :href="item.package.links.homepage" target="_blank" outline text-color="blue-9" dense
                   icon="mdi-home"/>
          </q-btn-group>
        </div>
        <div class="package-keywords row full-width items-center" v-if="item.package?.keywords">
          <q-chip
              clickable
              color="grey-7"
              outline
              v-for="keyword in item.package.keywords.slice(0, 3)"
              @click="searchQuery = keyword"
          >{{ keyword }}
          </q-chip>
          <q-chip
              clickable
              color="grey-7"
              outline
              v-if="item.package.keywords.length > 3"
          > and {{ item.package.keywords.length - 3 }} more
          </q-chip>
        </div>
      </q-card>
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
    />

    <q-dialog class="package-details-modal q-pa-none" v-model="isPackageSelected">
      <q-card class="q-pa-sm" v-if="selectedPackage && selectedPackageMeta && selectedPackageEntrypoint">
        <q-toolbar class="column q-pb-sm">
          <q-toolbar-title class="full-width justify-between q-pa-none">
            <div class="column">
              <div class="row">
                  <span class="text-weight-bold ellipsis-2-lines">
                    {{ selectedPackage.package.name }}
                  </span>
                <q-chip color="blue-5" outline>
                  v. {{ selectedPackage.package.version }}
                </q-chip>
              </div>
              <div v-if="!!selectedPackage.package?.author" class="row text-subtitle1">
                <p class="q-my-none">
                  by {{ selectedPackage.package.author.name }}
                </p>
              </div>
            </div>
          </q-toolbar-title>
        </q-toolbar>

        <q-btn-group class="q-mx-auto" spread rounded color="blue-9">
          <q-btn
              :href="selectedPackage.package.links.npm"
              target="_blank"
              text-color="blue-9"
              rounded
              no-caps
              icon-right="mdi-npm"
              label="NPM"
          />
          <q-btn
              :href="selectedPackage.package.links.repository"
              target="_blank"
              text-color="blue-9"
              rounded
              no-caps
              icon-right="mdi-git"
              label="GitHub"
          />
          <q-btn
              :href="selectedPackage.package.links.homepage"
              target="_blank"
              text-color="blue-9"
              rounded
              no-caps
              icon-right="mdi-home"
              label="Homepage"
          />
        </q-btn-group>

        <q-card-section class="column q-px-sm">
          <span class="q-pl-sm text-weight-bold">Description:</span>
          <span class="q-mb-md">{{ selectedPackage.package.description }}</span>

          <span class="q-pl-sm text-weight-bold">jsDelivr CDN link:</span>
          <q-btn
              class="full-width q-mb-md"
              no-caps
              color="blue-7"
              outline
              icon-right="mdi-copy"
              @click="copyToClipboard(computedDelivrCDNLink)"
          >
            {{
              computedDelivrCDNLink
            }}
          </q-btn>

          <span class="q-pl-sm text-weight-bold">Yarn install:</span>
          <q-btn
              class="full-width q-mb-md"
              no-caps
              color="blue-7"
              outline
              icon-right="mdi-copy"
              @click="copyToClipboard(computedYarnCommand)"
          >
            {{
              computedYarnCommand
            }}
          </q-btn>

          <span class="q-pl-sm text-weight-bold">NPM install:</span>
          <q-btn
              class="full-width q-mb-md"
              no-caps
              color="blue-7"
              outline
              icon-right="mdi-copy"
              @click="copyToClipboard(computedNpmCommand)"
          >
            {{
              computedNpmCommand
            }}
          </q-btn>

          <div class="package-keywords row full-width items-center" v-if="selectedPackage.package?.keywords">
            <q-chip
                clickable
                color="grey-7"
                outline
                v-close-popup
                v-for="keyword in selectedPackage.package.keywords"
                @click="searchQuery = keyword"
            >
              {{ keyword }}
            </q-chip>
          </div>
        </q-card-section>
        <q-btn class="full-width" color="red" outline v-close-popup @click="isPackageSelected = false">Close Popup
        </q-btn>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import {computed, type Ref, ref, watch} from "vue";
import {searchNpmPackages} from "@/api/npmApiRepo";
import type {PackageFromSearch, PackageNpmMetadata} from "@/types";
import {getPackageNpmEntrypoint, getPackageNpmMetadata} from "@/api/jsdeliverRepo";
import {copyToClipboard} from "quasar";

const packages: Ref<PackageFromSearch[]> = ref([]);

const selectedPackage: Ref<PackageFromSearch | null> = ref(null);
const selectedPackageMeta: Ref<PackageNpmMetadata | null> = ref(null);
const selectedPackageEntrypoint = ref("");
const isPackageSelected = ref(false);
const copiedLink = ref("");

const searchQuery = ref("");
const page = ref(1);
const per_page = ref(10);
const total_pages = ref(0);
const loading = ref(true);

const offset = computed(() => {
  return per_page.value * (page.value - 1);
})

const computedDelivrCDNLink = computed(() => {
  return `https://cdn.jsdelivr.net/npm/${selectedPackage.value?.package.name}@${selectedPackage.value?.package.version}${selectedPackageEntrypoint.value}`
})

const computedYarnCommand = computed(() => {
  return `yarn install ${selectedPackage.value?.package.name}@${selectedPackage.value?.package.version}`
})

const computedNpmCommand = computed(() => {
  return `npm install ${selectedPackage.value?.package.name}@${selectedPackage.value?.package.version}`
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
  selectedPackageMeta.value = await getPackageNpmMetadata(pckg.package.name);
  selectedPackageEntrypoint.value = await getPackageNpmEntrypoint(pckg.package.name, pckg.package.version);
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

  &__item {
    width: 100%;
    min-height: 3rem;
    max-width: 40rem;
    background-color: $primary-light;
    border-color: $primary;

    .q-badge {
      min-height: fit-content;
      height: fit-content;
      margin: auto 0;
    }
  }

  &.loading {
    pointer-events: none;
    filter: blur(3px);
  }
}

.q-pagination {
  margin: 2rem 0;
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
