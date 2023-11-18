<template>
  <q-card class="card-package-wide column q-pa-sm" flat>
    <div class="package-main-info row no-wrap full-width items-start">
      <div class="row">
        <q-chip clickable @click="emits('select', npmPackage)">
          {{ npmPackage.package.name }}
          <q-tooltip :delay="500" :offset="[0, 10]">{{ npmPackage.package.description }}</q-tooltip>
        </q-chip>
        <q-badge align="middle" color="blue-5" outline>
          v. {{ npmPackage.package.version }}
        </q-badge>
      </div>
      <q-space />
      <q-btn-group class="package-links" flat outline color="blue-9">
        <q-btn
          :href="npmPackage.package.links.npm"
          dense
          icon="mdi-npm"
          outline
          target="_blank"
          text-color="blue-9"
        />
        <q-btn
          :href="npmPackage.package.links.repository"
          dense
          icon="mdi-git"
          outline
          target="_blank"
          text-color="blue-9"
        />
        <q-btn
          :href="npmPackage.package.links.homepage"
          dense
          icon="mdi-home"
          outline
          target="_blank"
          text-color="blue-9"
        />
      </q-btn-group>
    </div>
    <div class="package-keywords row full-width items-center" v-if="npmPackage.package?.keywords">
      <q-chip
        v-for="keyword in npmPackage.package.keywords.slice(0, 3)"
        clickable
        color="grey-7"
        outline
        @click="emits('search', keyword)"
        >{{ keyword }}
      </q-chip>
      <q-chip v-if="npmPackage.package.keywords.length > 3" clickable color="grey-7" outline>
        and {{ npmPackage.package.keywords.length - 3 }} more
      </q-chip>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import type { PackageFromSearch } from '@/types'

const emits = defineEmits(['search', 'select'])

const props = defineProps<{
  npmPackage: PackageFromSearch
}>()
</script>

<style lang="scss">
@import '@/styles/variables.scss';

.card-package-wide {
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
</style>
