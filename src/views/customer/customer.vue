<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <div class="upload-form">
    <CustomDataTable
      ref="dataTableRef"
      :headers="headers"
      api-resource="api/customers"
      :auto-fetch="true"
      :show-pagination="true"
      :height="550"
      :show-refresh-button="true"
      :actions="['delete', 'edit', 'create', 'filter']"
      date-with-timezone
      :axiosInstance="axiosInstance"
    />
  </div>
  <!-- Success/Error Messages -->
  <v-snackbar v-model="showSnackbar" :color="snackbarColor" timeout="3000">
    {{ snackbarMessage }}
  </v-snackbar>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { CustomDataTable, BaseBreadcrumb,BooleanEnumOptions } from '@amirjalili1374/ui-kit';
import axiosInstance from '@/services/axiosInstance';

const breadcrumbs = ref([
  {
    title: 'نوع محصول',
    disabled: false,
    href: '#'
  }
]);
const page = ref({ title: 'عملیات' });
// Reactive data
const dataTableRef = ref();
const showSnackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('success');

const headers = computed(() => [
  {
    title: 'نام مشتری',
    key: 'fullName',
    sortable: true,
    width: 200,
  },
  {
    title: 'شماره تماس',
    key: 'phone',
    sortable: true,
    width: 200,
  },
]);
</script>
