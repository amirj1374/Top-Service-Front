<template>
  <div>
    <v-container fluid>
      Loading State
      <v-row v-if="customizer.loading">
        <v-col cols="12" class="text-center">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          <p class="mt-4">در حال بارگذاری اطلاعات کاربر...</p>
        </v-col>
      </v-row>

      <!-- Error State -->
      <v-row v-else-if="customerInfoStore.error">
        <v-col cols="12">
          <v-alert type="error" title="خطا در بارگذاری اطلاعات" :text="customerInfoStore.error"></v-alert>
        </v-col>
      </v-row>

      <!-- Dashboard Content -->
      <div v-else>
        <!-- Plate Input Section -->
        <v-row>
          <v-col cols="12">
            <v-card class="mb-4">
              <v-card-title class="d-flex align-center">
                <span>جستجوی پلاک خودرو</span>
              </v-card-title>
              <v-card-text>
                <v-form>
                  <IranianPlateInput 
                    v-model="plateNumber" 
                    label="شماره پلاک" 
                    :required="true"
                  />
                  <v-btn 
                    color="primary" 
                    class="mt-4" 
                    :disabled="!plateNumber || plateNumber.split(' ').length < 4"
                    @click="handlePlateSearch"
                  >
                    جستجو
                  </v-btn>
                  <v-alert 
                    v-if="searchResult" 
                    type="success" 
                    class="mt-4"
                    :text="`نتایج جستجو برای پلاک: ${plateNumber}`"
                  ></v-alert>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Welcome Section -->
        <v-row>
          <v-col cols="12">
            <v-card class="mb-4">
              <v-card-title class="d-flex align-center">
              </v-card-title>
              <v-card-text>
                <!-- <total-income></total-income> -->
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- User Information Cards -->
        <v-row>
          <!-- Personal Information -->
          <v-col cols="12" md="6" class="d-flex">
            <v-card class="w-100 h-100">
              <v-card-text class="pa-0">
                <!-- <total-growth /> -->
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" class="d-flex">
            <v-card class="w-100 h-100">
              <v-card-text class="pa-0">
                <!-- <data-labels /> -->
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Branch Information -->
          <!--          <v-col cols="12" md="6">-->
          <!--            <v-card class="mb-4">-->
          <!--              <v-card-title class="d-flex align-center">-->
          <!--                اطلاعات شعبه-->
          <!--              </v-card-title>-->
          <!--              <v-card-text>-->
          <!--                <total-pay></total-pay>-->
          <!--              </v-card-text>-->
          <!--            </v-card>-->
          <!--          </v-col>-->
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script setup>
import { useCustomerInfoStore } from '@/stores/customerInfo';
import { useCustomizerStore } from '@/stores/customizer';
import DataLabels from '@/views/dashboards/default/components/DataLabels.vue';
import TotalGrowth from '@/views/dashboards/default/components/TotalGrowth.vue';
import TotalIncome from '@/views/dashboards/default/components/TotalIncome.vue';
import IranianPlateInput from '@/components/IranianPlateInput.vue';
import { computed, ref } from 'vue';

const customerInfoStore = useCustomerInfoStore();
const customizer = useCustomizerStore();

// Plate search state
const plateNumber = ref('');
const searchResult = ref(null);

// Get user info from store
const userInfo = computed(() => customerInfoStore.getUserInfo);

// Handle plate search
function handlePlateSearch() {
  if (plateNumber.value) {
    // Here you can add your API call to search for the plate
    console.log('Searching for plate:', plateNumber.value);
    searchResult.value = `پلاک ${plateNumber.value} یافت شد`;
    
    // Example API call:
    // api.searchPlate(plateNumber.value).then(response => {
    //   searchResult.value = response.data;
    // }).catch(error => {
    //   console.error('Plate search error:', error);
    // });
  }
}

// Format date helper function
const formatDate = (dateString) => {
  if (!dateString) return 'نامشخص';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return dateString;
  }
};
</script>

<style scoped>
.equal-height {
  display: flex;
  align-items: stretch;
}

.equal-height > * {
  flex: 1;
}
/* Add any custom styles here */
</style>
