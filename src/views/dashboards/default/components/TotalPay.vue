<script setup lang="ts">
import { ref, computed } from 'vue';

const tab = ref('1');

const chartOptions1 = computed(() => {
  return {
    chart: {
      type: 'bar',
      height: 90,
      fontFamily: `inherit`,
      foreColor: '#a1aab2',
      sparkline: {
        enabled: true
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#fff'],
    fill: {
      type: 'solid',
      opacity: 1
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    yaxis: {
      min: 0,
      max: 100
    },
    tooltip: {
      theme: 'dark',
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: () => 'مقدار واریزی'
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
      name: 'series1',
      data: [35, 44, 60, 70, 60, 90, 82, 100]
    }
  ]
};

// chart 2
const chartOptions2 = computed(() => {
  return {
    chart: {
      type: 'bar',
      height: 90,
      fontFamily: `inherit`,
      foreColor: '#a1aab2',
      sparkline: {
        enabled: true
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#fff'],
    fill: {
      type: 'solid',
      opacity: 1
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    yaxis: {
      min: 0,
      max: 100
    },
    tooltip: {
      theme: 'dark',
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: () => 'مقدار واریزی'
        }
      },
      marker: {
        show: false
      }
    }
  };
});

// chart 1
const lineChart2 = {
  series: [
    {
      name: 'series1',
      data: [35, 44, 60, 70, 60, 90, 82, 69]
    }
  ]
};
</script>

<template>
  <v-card elevation="0" class="bg-primary overflow-hidden bubble-shape bubble-primary-shape">
    <v-card-text>
      <div class="d-flex align-start mb-3">
        <div class="ml-auto z-1">
          <v-tabs v-model="tab" class="theme-tab" density="compact" align-tabs="end">
            <v-tab value="1" hide-slider color="transparent">ماهانه</v-tab>
            <v-tab value="2" hide-slider color="transparent">سالانه</v-tab>
          </v-tabs>
        </div>
      </div>
      <v-tabs-window v-model="tab" class="z-1">
        <v-tabs-window-item value="1">
          <v-row>
            <v-col cols="6">
              <h2 class="text-h1 font-weight-medium">
                 25,000,000
              </h2>
              <span class="text-subtitle-1 text-medium-emphasis text-white">مقدار واریزی</span>
            </v-col>
            <v-col cols="6">
              <apexchart type="line" height="90" :options="chartOptions1" :series="lineChart1.series"> </apexchart>
            </v-col>
          </v-row>
        </v-tabs-window-item>
        <v-tabs-window-item value="2">
          <v-row>
            <v-col cols="6">
              <h2 class="text-h1 font-weight-medium">
                225,000,000
              </h2>
              <span class="text-subtitle-1 text-medium-emphasis text-white">مقدار واریزی</span>
            </v-col>
            <v-col cols="6">
              <apexchart type="line" height="90" :options="chartOptions2" :series="lineChart2.series"> </apexchart>
            </v-col>
          </v-row>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>
