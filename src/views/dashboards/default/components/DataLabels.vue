<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import vuetify from '@/plugins/vuetify';
import { useCustomizerStore } from '@/stores/customizer';
import { api } from '@/services/api';

const customizerStore = ref(useCustomizerStore());
const currentTheme = ref(vuetify.theme.themes.value[customizerStore.value.getActTheme]);

const labels = ref<string[]>([]);
const percentages = ref<number[]>([]);
const numbers = ref<number[]>([]);
const isLoading = ref<boolean>(true);
const loadError = ref<string | null>(null);

watch(() => customizerStore.value.getActTheme, (newTheme) => {
  currentTheme.value = vuetify.theme.themes.value[newTheme];
});

onMounted(async () => {
  isLoading.value = true;
  loadError.value = null;
  try {
    const res = await api.user.getCartableCount();
    if (res?.status === 200) {
      const data = res.data;
      if (Array.isArray(data?.labels)) {
        labels.value = data.labels;
      }
      if (Array.isArray(data?.percentages)) {
        percentages.value = data.percentages.map((n: unknown) => Number(n) || 0);
      }
      if (Array.isArray(data?.numbers)) {
        numbers.value = data.numbers.map((n: unknown) => Number(n) || 0);
      }
    }
    if (!labels.value.length) labels.value = ['—'];
    if (!percentages.value.length) percentages.value = [0];
  } catch (err: unknown) {
    const message = (err as { message?: string })?.message || 'خطا در دریافت داده ها';
    loadError.value = message;
    labels.value = ['—'];
    percentages.value = [0];
  } finally {
    isLoading.value = false;
  }
});
const chartOptions = computed(() => {
  return {
    chart: {
      type: 'radialBar',
      height: 350,
      fontFamily: `inherit`,
      foreColor: currentTheme.value.colors.secondary
    },
    colors: [
      currentTheme.value.colors.primary,
      currentTheme.value.colors.secondary,
      currentTheme.value.colors.secondary200,
      currentTheme.value.colors.success
    ],
    labels: labels.value,
    plotOptions: {
      radialBar: {
        hollow: {
          size: '58%'
        },
        track: {
          background: currentTheme.value.colors.primary100 || '#f2f2f2'
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: '12px',
            fontFamily: 'vazir, sans-serif'
          },
          value: {
            show: true,
            fontSize: '18px',
            fontFamily: 'vazir, sans-serif',
            formatter: (val: number, opts: any) => {
              const index = opts.seriesIndex;
              return `${Math.round(val)}%`;
            }
          },
          total: {
            show: true,
            label: 'کل درخواست ها',
            fontFamily: 'vazir, sans-serif',
            formatter: () => {
              const total = numbers.value.reduce((a: number, b: number) => a + b, 0);
              return `${total}`;
            }
          }
        }
      }
    },
    stroke: {
      lineCap: 'round'
    },
    tooltip: {
      theme: 'dark'
    }
  };
});

const series = computed(() => percentages.value);
</script>

<template>
  <v-card elevation="0">
    <v-card>
      <v-card-text>
        <span class="text-subtitle-2 text-disabled font-weight-bold">وضعیت درخواست های کارتابل</span>
        <h3 class="text-h3 mt-1">بر اساس نوع وضعیت</h3>
        <div class="mt-4">
          <template v-if="isLoading">
            <div class="d-flex justify-center py-8">
              <v-progress-circular indeterminate color="primary" size="40" />
            </div>
          </template>
          <template v-else>
            <apexchart 
              type="radialBar" 
              height="350" 
              :options="chartOptions" 
              :series="series"
              :key="`chart-${percentages.length}-${labels.length}`"
            ></apexchart>
            <v-alert v-if="loadError" type="warning" class="mt-4" :text="loadError" variant="tonal" />
          </template>
        </div>
      </v-card-text>
    </v-card>
  </v-card>
  
</template>


