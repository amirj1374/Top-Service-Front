<script setup lang="ts">
// imported components
import TotalEarning from './components/TotalEarning.vue';
import TotalOrder from './components/TotalOrder.vue';
import TotalIncome from './components/TotalIncome.vue';
import TotalGrowth from './components/TotalGrowth.vue';
import PopularStocks from './components/PopularStocks.vue';
import TotalPay from '@/views/dashboards/default/components/TotalPay.vue';
</script>

<template>
  <v-row>

<!--   first row-->

    <v-col cols="12" md="4">
      <TotalOrder />
    </v-col>

    <v-col cols="12" md="4">
      <TotalEarning />
    </v-col>

    <v-col cols="12" md="4">
      <TotalPay />
    </v-col>

<!--    second row-->

    <v-col cols="12" md="12">
      <TotalIncome />
    </v-col>

    <v-col cols="12" lg="8">
      <TotalGrowth />
    </v-col>`

    <v-col cols="12" lg="4">
      <PopularStocks />
    </v-col>
  </v-row>
</template>
