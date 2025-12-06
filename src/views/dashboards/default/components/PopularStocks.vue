<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import vuetify from '@/plugins/vuetify';
import { useCustomizerStore } from '@/stores/customizer';
const customizerStore = ref(useCustomizerStore());
const currentTheme = ref(vuetify.theme.themes.value[customizerStore.value.getActTheme]);

// import icons
import { IconChevronUp, IconChevronDown } from '@tabler/icons-vue';
// Watch for theme changes and update currentTheme dynamically
watch(() => customizerStore.value.getActTheme, (newTheme) => {
  currentTheme.value = vuetify.theme.themes.value[newTheme];
});
// chart 1
const chartOptions1 = computed(() => {
  return {
    chart: {
      type: 'area',
      height: 95,
      fontFamily: `inherit`,
      foreColor: currentTheme.value.colors.primary200,
      sparkline: {
        enabled: true
      }
    },
    colors: [currentTheme.value.colors.secondary],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 1
    },
    tooltip: {
      theme: 'light',
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: () => 'Ticket '
        }
      },
      marker: {
        show: false
      }
    }
  };
});

// chart 1
const lineChart1 = {
  series: [
    {
      data: [0, 15, 10, 50, 30, 40, 25]
    }
  ]
};

const revenues = ref([
  {
    name: 'سهام عدالت',
    price: 145.58,
    profit: 10
  },
  {
    name: 'خساپا',
    price: 6.368,
    profit: 10
  },
  {
    name: 'شتران',
    price: 458.63,
    profit: 10
  },
  {
    name: 'وبملت',
    price: 5.631,
    profit: 10
  },
  {
    name: 'بکهنوج',
    price: 6.368,
    profit: 10
  }
]);
</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <div class="d-flex align-center">
          <h4 class="text-h4 mt-1">سهام های برتر</h4>
          <div class="ml-auto">
            <v-menu transition="slide-y-transition">
              <template v-slot:activator="{ props }">
                <v-btn color="primary" size="small" icon rounded="sm" variant="text" v-bind="props">
                  <DotsIcon stroke-width="1.5" width="25" />
                </v-btn>
              </template>
              <v-sheet rounded="md" width="150" class="elevation-10">
                <v-list>
                  <v-list-item value="1">
                    <v-list-item-title>روزانه</v-list-item-title>
                  </v-list-item>
                  <v-list-item value="2">
                    <v-list-item-title>هفتگی</v-list-item-title>
                  </v-list-item>
                  <v-list-item value="3">
                    <v-list-item-title>ماهانه</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-sheet>
            </v-menu>
          </div>
        </div>
        <v-card class="bg-lightsecondary mt-5">
          <div class="pa-5">
            <div class="d-flex align-start justify-space-between">
              <div>
                <h6 class="text-secondary text-h5">سهام عدالت</h6>
                <span class="text-subtitle-2 text-medium-emphasis font-weight-bold">10% سود</span>
              </div>
              <h4 class="text-h4">2,758 ریال</h4>
            </div>
          </div>
          <apexchart type="area" height="95" :options="chartOptions1" :series="lineChart1.series"> </apexchart>
        </v-card>
        <div class="mt-4">
          <perfect-scrollbar v-bind:style="{ height: '270px' }">
            <v-list lines="two" class="py-0">
              <v-list-item v-for="(revenue, i) in revenues" :key="i" :value="revenue" color="secondary" rounded="sm">
                <template v-slot:append>
                  <div
                    class="bg-lightsuccess rounded-sm d-flex align-center justify-center ml-3"
                    style="width: 20px; height: 20px"
                    v-if="revenue.price > 145"
                  >
                    <IconChevronUp stroke-width="1.5" width="20" class="text-success" />
                  </div>
                  <div class="bg-lighterror rounded-sm d-flex align-center justify-center ml-3" style="width: 20px; height: 20px" v-else>
                    <IconChevronDown stroke-width="1.5" width="20" class="text-error" />
                  </div>
                </template>
                <div class="d-inline-flex align-center justify-space-between w-100">
                  <div>
                    <h6 class="text-subtitle-1 text-medium-emphasis font-weight-bold">
                      {{ revenue.name }}
                    </h6>
                    <span v-if="revenue.price > 145" class="text-success text-subtitle-2">{{ revenue.profit }}% سود</span>
                    <span v-else class="text-error text-subtitle-2">{{ revenue.profit }}% سود</span>
                  </div>
                </div>
              </v-list-item>
            </v-list>
          </perfect-scrollbar>

          <div class="text-center mt-3">
            <v-btn color="primary" variant="text"
              >نمایش همه
              <template v-slot:append>
                <ChevronRightIcon stroke-width="1.5" width="20" />
              </template>
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-card>
</template>
