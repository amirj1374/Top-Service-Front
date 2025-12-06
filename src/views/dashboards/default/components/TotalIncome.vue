<script setup lang="ts">
import { IconBuildingStore, IconTableShare } from '@tabler/icons-vue'
import { useCustomerInfoStore } from '@/stores/customerInfo'
// import { RoleTypeOptions } from '@/types/enums/global'

// 🟢 store
const customerInfoStore = useCustomerInfoStore()

// 🟢 build a map of valid roles
// const roleTitleMap = Object.fromEntries(
//   RoleTypeOptions.map(opt => [opt.value, opt.title])
// )

// 🟢 translate + filter only valid roles
// const translateRoles = (roles: string[] = []): string[] =>
//   roles
//     .filter(role => role in roleTitleMap)
//     .map(role => roleTitleMap[role])
</script>


<template>
  <div class="total-income">
    <!-- Role -->
    <v-card elevation="0" class="bubble-shape-sm overflow-hidden bubble-warning">
      <v-card-text class="pa-5">
        <div class="d-flex align-center ga-4">
          <v-btn color="lightsecondary" icon rounded="sm" variant="flat" class="ti-btn-secondary">
            <IconBuildingStore stroke-width="1.5" width="25" class="ti-icon" />
          </v-btn>
          <div>
            <h3 class="text-h3 font-weight-medium">
              <!-- {{
                customerInfoStore.userInfo?.lotusRoles
                  ? translateRoles(customerInfoStore.userInfo.lotusRoles).join('، ')
                  : '-'
              }} -->
            </h3>
            <span class="text-subtitle-1 text-disabled font-weight-medium">نقش</span>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Full Name -->
    <v-card elevation="0" class="bg-primary overflow-hidden bubble-shape-sm bubble-primary">
      <v-card-text class="pa-5">
        <div class="d-flex align-center ga-4">
          <v-btn color="darkprimary" icon rounded="sm" variant="flat" class="ti-btn-primary">
            <IconTableShare stroke-width="1.5" width="25" class="ti-icon" />
          </v-btn>
          <div>
            <h3 class="text-h3 font-weight-medium">{{ customerInfoStore.userInfo?.fullName }}</h3>
            <span class="text-subtitle-1 text-medium-emphasis text-white">نام و نام خانوادگی</span>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Branch -->
    <v-card elevation="0" class="bubble-shape-sm overflow-hidden bubble-warning">
      <v-card-text class="pa-5">
        <div class="d-flex align-center ga-4">
          <v-btn color="lightsecondary" icon rounded="sm" variant="flat" class="ti-btn-secondary">
            <IconBuildingStore stroke-width="1.5" width="25" class="ti-icon" />
          </v-btn>
          <div>
            <h3 class="text-h3 font-weight-medium">{{ customerInfoStore.userInfo?.branchCode }} - {{ customerInfoStore.userInfo?.branchName }}</h3>
            <span class="text-subtitle-1 text-disabled font-weight-medium">شعبه</span>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.total-income {
  display: flex;
  gap: 1rem;
}

/* Icon color inherits currentColor; control via button context */
.ti-icon {
  color: rgb(var(--v-theme-secondary));
}

/* Primary button icon default/hover */
.ti-btn-primary .ti-icon {
  color: rgb(var(--v-theme-on-primary));
}
.ti-btn-primary:hover {
  background-color: rgb(var(--v-theme-primary));
}
.ti-btn-primary:hover .ti-icon {
  color: rgb(var(--v-theme-on-primary));
}

/* Secondary (light) button icon default/hover */
.ti-btn-secondary .ti-icon {
  color: rgb(var(--v-theme-secondary));
}
.ti-btn-secondary:hover {
  background-color: rgb(var(--v-theme-secondary));
}
.ti-btn-secondary:hover .ti-icon {
  color: rgb(var(--v-theme-on-secondary));
}
</style>
