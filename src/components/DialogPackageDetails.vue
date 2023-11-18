<template>
  <q-dialog class="package-details-modal q-pa-none">
    <q-card class="q-pa-sm" v-if="selectedPackageMeta && selectedPackageEntrypoint">
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

      <q-card-section class="package-install-info column q-px-sm">
        <span class="q-pl-sm text-weight-bold">Description:</span>
        <span class="q-mb-md">{{ selectedPackage.package.description }}</span>

        <span class="q-pl-sm text-weight-bold">jsDelivr CDN link:</span>
        <q-btn
            class="full-width q-mb-md"
            no-caps
            color="blue-7"
            outline
            icon-right="mdi-content-copy"
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
            icon-right="mdi-content-copy"
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
            icon-right="mdi-content-copy"
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
              @click="emits('search', keyword)"
          >
            {{ keyword }}
          </q-chip>
        </div>
      </q-card-section>
      <q-btn class="full-width" color="red" outline v-close-popup @click="emits('close')">
        Close Popup
      </q-btn>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {copyToClipboard} from "quasar";
import {computed, onBeforeMount, ref, type Ref} from "vue";
import type {PackageFromSearch, PackageNpmMetadata} from "@/types";
import {getPackageNpmEntrypoint, getPackageNpmMetadata} from "@/api/jsdeliverRepo";

const selectedPackageMeta: Ref<PackageNpmMetadata | null> = ref(null);
const selectedPackageEntrypoint = ref("");

const props = defineProps<{
  selectedPackage: PackageFromSearch,
}>();

const emits = defineEmits(['search', 'close']);

onBeforeMount(async () => {
  selectedPackageMeta.value = await getPackageNpmMetadata(
      props.selectedPackage?.package.name
  );
  selectedPackageEntrypoint.value = await getPackageNpmEntrypoint(
      props.selectedPackage?.package.name,
      props.selectedPackage?.package.version
  );
})

const computedDelivrCDNLink = computed(() => {
  return `https://cdn.jsdelivr.net/npm/${props.selectedPackage?.package.name}@${props.selectedPackage?.package.version}${selectedPackageEntrypoint.value}`
})

const computedYarnCommand = computed(() => {
  return `yarn install ${props.selectedPackage?.package.name}@${props.selectedPackage?.package.version}`
})

const computedNpmCommand = computed(() => {
  return `npm install ${props.selectedPackage?.package.name}@${props.selectedPackage?.package.version}`
})
</script>

<style lang="scss">
@import "@/styles/variables.scss";

.package-details-modal {
  .package-install-info {
    .q-btn {
      .q-btn__content {
        width: 100%;
        flex-wrap: nowrap;
        justify-content: space-between;
        text-align: start;
        color: $secondary;
      }
    }
  }
}
</style>