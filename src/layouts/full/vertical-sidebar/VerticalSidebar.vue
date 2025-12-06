<script setup lang="ts">
import { computed } from 'vue';
import { useCustomizerStore } from '@/stores/customizer';
import { useCustomerInfoStore } from '@/stores/customerInfo';
import sidebarItems, { getFilteredSidebarItems, type menu } from './sidebarItem';

import { AppSidebar } from '@amirjalili1374/ui-kit';
import LogoDark from '../logo/LogoDark.vue';
import { useRoute } from 'vue-router';

const customizer = useCustomizerStore();
const route = useRoute();
const customerInfo = useCustomerInfoStore();

interface CustomMenuItem {
  title: string;
  to?: string;
  icon?: any;
  disabled?: boolean;
  items?: CustomMenuItem[];
  chipContent?: string;
  chipColor?: string;
}

function toMenuItems(items: menu[]): CustomMenuItem[] {
  return items.map((it) => ({
    title: it.title || '',
    to: it.to,
    icon: it.icon as unknown as any,
    disabled: it.disabled,
    items: it.children ? toMenuItems(it.children) : undefined,
    chipContent: it.chip,
    chipColor: it.chipColor || 'primary',
  }));
}

const rawMenu = computed<menu[]>(() =>
  customerInfo.isUserInfoLoaded ? getFilteredSidebarItems() : sidebarItems
);

const sidebarMenu = computed<CustomMenuItem[]>(() => toMenuItems(rawMenu.value));

function hasActiveChild(children: menu[]): boolean {
  return children.some((child) => {
    if (!child.to) return false;
    return route.path === child.to || route.path.startsWith(child.to + '/');
  });
}
</script>

<template>
  <AppSidebar
    :sidebar-items="rawMenu"
    :get-filtered-sidebar-items="getFilteredSidebarItems"
    :logo-component="LogoDark"
    :sidebar-drawer="customizer.Sidebar_drawer"
    :mini-sidebar="customizer.mini_sidebar"
    @update:sidebarDrawer="customizer.SET_SIDEBAR_DRAWER"
  />
</template>
<style>
/* Completely hide text when sidebar is closed */
.rightSidebar.sidebar-closed .v-list-item-title,
.rightSidebar.sidebar-closed .v-list-item-subtitle,
.rightSidebar.sidebar-closed .v-list-subheader {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
}

/* Also hide when in rail mode */
.rightSidebar.v-navigation-drawer--rail .v-list-item-title,
.rightSidebar.v-navigation-drawer--rail .v-list-item-subtitle,
.rightSidebar.v-navigation-drawer--rail .v-list-subheader {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
}
</style>
