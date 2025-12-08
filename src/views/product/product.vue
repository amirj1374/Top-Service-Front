<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <div class="upload-form">
      <CustomDataTable
        ref="dataTableRef"
        :headers="headers"
        api-resource="api/products"
        :auto-fetch="true"
        :show-pagination="true"
        :height="530"
        :show-refresh-button="true"
        :actions="['delete', 'edit', 'create']"
        date-with-timezone
        :axiosInstance="axiosInstance"
        group-by="groupByItem"
        :default-expanded="true"
        :page-size="100"
        bulkMode
        selectable
      />
    </div>
    <!-- Success/Error Messages -->
    <v-snackbar v-model="showSnackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { CustomDataTable, BaseBreadcrumb } from '@amirjalili1374/ui-kit';
  import axiosInstance from '@/services/axiosInstance';
  
  const breadcrumbs = ref([
    {
      title: 'محصول',
      disabled: false,
      href: '#'
    }
  ]);

  const page = ref({ title: 'محصول' });
  // Reactive data
  const dataTableRef = ref();
  const showSnackbar = ref(false);
  const snackbarMessage = ref('');
  const snackbarColor = ref('success');

  const headers = computed(() => [
    {
      title: 'نام محصول',
      key: 'name',
      sortable: true,
      width: 200
    },
    {
      title: 'تاریخ ایجاد',
      key: 'createdAt',
      sortable: true,
      width: 200,
      isDate: true,
      excludeFromForm: true
    },
    {
      title: 'توضیحات',
      key: 'description',
      sortable: true,
      width: 200
    },
    {
      title: 'فی',
      key: 'price',
      sortable: false,
      width: 100,
      type: 'money'
    },
    {
      title: 'موجودی',
      key: 'stock',
      sortable: false,
      width: 100,
    },
    { 
      title: 'تاریخ آخرین ویرایش',
      key: 'updatedAt',
      sortable: false,
      width: 100,
      isDate: true,
      excludeFromForm: true
    }
  ]);
  </script>
  