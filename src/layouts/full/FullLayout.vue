<script setup lang="ts">
import { RouterView } from 'vue-router';
import { computed } from 'vue';
import VerticalSidebarVue from './vertical-sidebar/VerticalSidebar.vue';
import VerticalHeaderVue from './vertical-header/VerticalHeader.vue';
import Customizer from './customizer/CustomizerPanel.vue';
import { useCustomizerStore } from '@/stores/customizer';
import { Loading } from '@amirjalili1374/ui-kit';

const customizer = useCustomizerStore();

// Computed property to ensure sidebar is shown
const showSidebar = computed(() => {
  const orientation = customizer.menuOrientation || 'vertical';
  return orientation === 'vertical';
});
</script>

<template>
  <v-locale-provider :rtl="true">
    <v-app
      :theme="customizer.actTheme"
      :class="[customizer.fontTheme, customizer.mini_sidebar ? 'mini-sidebar' : '', customizer.inputBg ? 'inputWithbg' : '']"
    >
      <Customizer />
      <!-- Show sidebar when menu orientation is vertical -->
      <VerticalSidebarVue v-if="customizer.menuOrientation === 'vertical'" />
      <VerticalHeaderVue />
      <v-main>
        <Loading />
        <v-container fluid class="page-wrapper">
          <div>
            <RouterView />
            <!-- <v-btn
              class="customizer-btn"
              size="small"
              variant="flat"
              color="secondary"
              @click.stop="customizer.SET_CUSTOMIZER_DRAWER(!customizer.Customizer_drawer)"
            >
              <IconSettings/>
            </v-btn> -->
          </div>
        </v-container>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>
<style lang="scss">
// Ensure sidebar and main content are positioned correctly below fixed header
:deep(.v-navigation-drawer.app-sidebar),
:deep(.v-navigation-drawer.rightSidebar) {
  top: 80px !important;
  height: calc(100vh - 80px) !important;
}

:deep(.v-main) {
  padding-top: 80px !important;
}
</style>
