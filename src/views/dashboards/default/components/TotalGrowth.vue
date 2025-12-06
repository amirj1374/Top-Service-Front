<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import vuetify from '@/plugins/vuetify';
import { useCustomizerStore } from '@/stores/customizer';
import { api } from '@/services/api';
const customizerStore = ref(useCustomizerStore()); // = DarkOrangeTheme
const currentTheme = ref(vuetify.theme.themes.value[customizerStore.value.getActTheme]);
const groupName = ref<string[]>([])
const seriesData = ref<Array<{name: string, data: number[]}>>([])
const isLoading = ref<boolean>(true)
const loadError = ref<string | null>(null)

const select = ref({ state: 'امروز', abbr: 'FL' });
// const items = [
//   { state: 'روزانه', abbr: 'FL' },
//   { state: 'ماهانه', abbr: 'GA' },
//   { state: 'سالانه', abbr: 'NE' }
// ];

// Persian labels for series names
const seriesLabels: Record<string, string> = {
  'TEMPORARY_REGISTRATION': 'ثبت موقت',
  'PENDING_PROCESS': 'در انتظار پردازش',
  'CORRECT_FROM_REGION': 'اصلاح از منطقه',
  'CORRECT_FROM_BRANCH': 'اصلاح از شعبه',
  'APPROVED': 'تایید شده',
  'REJECTED': 'رد شده',
  'DELETED': 'حذف شده',
  'AWAITING_START_CARTABLE': 'در انتظار شروع کارتابل'
};

// Watch for theme changes and update currentTheme dynamically
watch(() => customizerStore.value.getActTheme, (newTheme) => {
  currentTheme.value = vuetify.theme.themes.value[newTheme];
});

onMounted(async ()=>{
  isLoading.value = true
  loadError.value = null
  try {
    const res = await api.user.getLoanRequestCount()
    if(res?.status === 200){
      const data = res.data
      if (Array.isArray(data?.requestType)) {
        groupName.value = data.requestType
      }
      if (Array.isArray(data?.series)) {
        seriesData.value = data.series.map((item: any) => ({
          name: seriesLabels[item.name] || item.name,
          data: item.data.map((n: unknown) => Number(n) || 0)
        }))
      }
    }
    if (!groupName.value.length) groupName.value = ['—']
    if (!seriesData.value.length) {
      seriesData.value = [{ name: 'داده ای موجود نیست', data: [0] }]
    }
  } catch (err: unknown) {
    const message = (err as { message?: string })?.message || 'خطا در دریافت داده ها'
    loadError.value = message
    groupName.value = ['—']
    seriesData.value = [{ name: 'خطا', data: [0] }]
  } finally {
    isLoading.value = false
  }
})
// chart 1
const chartOptions1 = computed(() => {
  return {
    chart: {
      type: 'bar',
      height: 350,
      fontFamily: `inherit`,
      foreColor: currentTheme.value.colors.darkText,
      stacked: true,
      toolbar: {
        show: false
      }
    },
    colors: [
      currentTheme.value.colors.primary900,
      currentTheme.value.colors.primary800,
      currentTheme.value.colors.primary700,
      currentTheme.value.colors.primary600,
      currentTheme.value.colors.primary500,
      currentTheme.value.colors.primary400,
      currentTheme.value.colors.primary300,
      currentTheme.value.colors.primary200,
    ],
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0
          }
        }
      }
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%'
      }
    },
    xaxis: {
      type: 'category',
      categories: groupName.value
    },
    legend: {
      show: true,
      fontFamily: `'vazir', sans-serif`,
      position: 'bottom',
      offsetX: 7,
      offsetY: 10,
      labels: {
        useSeriesColors: false,
        padding: 8,
        margin: 12
      },
      markers: {
        width: 16,
        height: 16,
        radius: 5,
        offsetX: -2,
        offsetY: 0
      },
      itemMargin: {
        horizontal: 20,
        vertical: 12
      },
      containerMargin: {
        top: 10,
        left: 0,
        right: 0
      }
    },
    fill: {
      type: 'solid'
    },
    dataLabels: {
      enabled: false
    },
    grid: {
      show: true
    },
    tooltip: {
      theme: 'dark'
    }
  };
});

// dynamic series from API
const lineChart1 = computed(() => ({
  series: seriesData.value
}))
</script>

<template>
  <v-card elevation="0">
    <v-card>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="9">
            <span class="text-subtitle-2 text-disabled font-weight-bold">آمار پرونده های ثبت شده</span>
            <h3 class="text-h3 mt-1">بر اساس نوع مصوبه</h3>
          </v-col>
<!--          <v-col cols="12" sm="3">-->
<!--            <v-select-->
<!--              color="primary"-->
<!--              variant="outlined"-->
<!--              hide-details-->
<!--              v-model="select"-->
<!--              :items="items"-->
<!--              item-title="state"-->
<!--              item-value="abbr"-->
<!--              label="Select"-->
<!--              persistent-hint-->
<!--              return-object-->
<!--              single-line-->
<!--            >-->
<!--            </v-select>-->
<!--          </v-col>-->
        </v-row>
        <div class="mt-4 chart-container">
          <template v-if="isLoading">
            <div class="d-flex justify-center py-8">
              <v-progress-circular indeterminate color="primary" size="40" />
            </div>
          </template>
          <template v-else>
            <apexchart 
              type="bar" 
              height="350" 
              :options="chartOptions1" 
              :series="lineChart1.series"
              :key="`chart-${seriesData.length}-${groupName.length}`"
              class="chart-wrapper"
            ></apexchart>
            <v-alert v-if="loadError" type="warning" class="mt-4" :text="loadError" variant="tonal" />
          </template>
        </div>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<style lang="scss" scoped>
.chart-container {
  padding: 8px;
  
  .chart-wrapper {
    margin-bottom: 16px;
  }
}

// Enhanced legend styling
:deep(.apexcharts-legend) {
  padding: 16px 8px !important;
  
  .apexcharts-legend-series {
    margin: 8px 12px !important;
    
    .apexcharts-legend-marker {
      margin-right: 8px !important;
    }
    
    .apexcharts-legend-text {
      padding: 4px 8px !important;
      font-size: 13px !important;
      line-height: 1.4 !important;
    }
  }
}

// Better spacing for chart elements
:deep(.apexcharts-chart) {
  padding: 8px;
}

:deep(.apexcharts-xaxis) {
  padding-top: 12px;
}

:deep(.apexcharts-yaxis) {
  padding-right: 8px;
}
</style>
