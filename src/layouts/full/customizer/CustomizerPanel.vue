<script setup lang="ts">
import { api } from '@/services/api';
import { useCustomizerStore } from '@/stores/customizer';
import type { CustomizerDTO } from '@/types/models/person';
import { IconMoon, IconSun } from '@tabler/icons-vue';
import { onMounted, ref, watch } from 'vue';
import { ToggleSwitch } from '@amirjalili1374/ui-kit';

const customizer = useCustomizerStore();

// Font Family options
const fontFamily = ref(['vazir', 'yekanLight', 'iranSans', 'kalamehLight', 'IranNastaliq', 'Massir']);
const snackbarMessage = ref('')
const snackbarColor = ref('')
const snackbar = ref(false);

// Valid theme names for validation
const validThemes = [
  'ModernTheme',
  'PurpleTheme', 
  'SteelTealGreen',
  'OrangeTheme',
  'TealTheme',
  'SilverTheme',
  'RedTheme',
  'NavyGoldTheme',
  'DarkModernTheme',
  'DarkPurpleTheme',
  'DarkSteelTealGreen',
  'DarkOrangeTheme',
  'DarkTealTheme',
  'DarkSilverTheme',
  'DarkRedTheme',
  'DarkNavyGoldTheme'
];

// Valid layout types
const validLayoutTypes = ['SideBar', 'NavBar'];

// Valid font themes
const validFontThemes = ['vazir', 'yekanLight', 'iranSans', 'kalamehLight', 'IranNastaliq', 'Massir'];

// Valid theme modes
const validThemeModes = ['light', 'dark'];

// Valid menu orientations
const validMenuOrientations = ['vertical', 'horizontal'];
// Theme color palette options (light versions only)
const colorPalette = ref([
  {
    themeName: 'ModernTheme',
    primary: '#6366f1',
    secondary: '#8b5cf6'
  },
  {
    themeName: 'PurpleTheme',
    primary: '#1e88e5',
    secondary: '#5e35b1'
  },
  {
    themeName: 'SteelTealGreen',
    primary: '#607D8B',
    secondary: '#009688'
  },
  {
    themeName: 'OrangeTheme',
    primary: '#C77E23',
    secondary: '#16595A'
  },
  {
    themeName: 'TealTheme',
    primary: '#00695C',
    secondary: '#4DB6AC'
  },
  {
    themeName: 'SilverTheme',
    primary: '#64748b',
    secondary: '#94a3b8'
  },
  {
    themeName: 'RedTheme',
    primary: '#203461',
    secondary: '#EC407A'
  },
  {
    themeName: 'NavyGoldTheme',
    primary: '#FFD43B',
    secondary: '#001F54'
  }
]);

// Function to get current theme name based on mode
function getCurrentThemeName(baseThemeName: string): string {
  return customizer.themeMode === 'dark' ? `Dark${baseThemeName}` : baseThemeName;
}
const payload: CustomizerDTO = {
  fontTheme: customizer.fontTheme,
  inputBg: customizer.inputBg,
  layoutType: customizer.layoutType,
  actTheme: customizer.actTheme,
  themeMode: customizer.themeMode,
  menuOrientation: customizer.menuOrientation,
};
// Validation functions
function validateTheme(theme: string): string {
  return validThemes.includes(theme) ? theme : 'PurpleTheme';
}

function validateLayoutType(layout: string): string {
  return validLayoutTypes.includes(layout) ? layout : 'SideBar';
}

function validateFontTheme(font: string): string {
  return validFontThemes.includes(font) ? font : 'vazir';
}

function validateThemeMode(mode: string): string {
  return validThemeModes.includes(mode) ? mode : 'light';
}

function validateMenuOrientation(orientation: string): string {
  return validMenuOrientations.includes(orientation) ? orientation : 'vertical';
}

function validateInputBg(inputBg: boolean): boolean {
  return typeof inputBg === 'boolean' ? inputBg : false;
}

async function setCustomizer() {
  try {
    // Validate and update payload with current values
    payload.fontTheme = validateFontTheme(customizer.fontTheme);
    payload.inputBg = validateInputBg(customizer.inputBg);
    payload.layoutType = validateLayoutType(customizer.layoutType);
    payload.actTheme = validateTheme(customizer.actTheme);
    payload.themeMode = validateThemeMode(customizer.themeMode);
    payload.menuOrientation = validateMenuOrientation(customizer.menuOrientation);
    
    const res = await api.user.setCustomizer({
      customizer: JSON.stringify(payload)
    });
    
    if (res) {
      snackbarMessage.value = 'تنظیمات با موفقیت ذخیره شد';
      snackbarColor.value = 'success';
      snackbar.value = true;
    }
  } catch (error) {
    console.error('Error saving customizer settings:', error);
    snackbarMessage.value = 'خطا در ذخیره تنظیمات';
    snackbarColor.value = 'error';
    snackbar.value = true;
  }
}
// Function to handle theme selection
function selectTheme(baseThemeName: string) {
  const themeName = getCurrentThemeName(baseThemeName);
  customizer.SET_THEME(themeName);
}

// Initial tabs
const tab = ref('style');

// Watch for changes in the fontTheme state from Pinia store
watch(
  () => customizer.fontTheme,
  (newFont) => {
    document.documentElement.style.setProperty('--font-theme', newFont);
  },
  { immediate: true }
);

// Watch for changes in the layoutType state from Pinia store
watch(
  () => customizer.layoutType,
  (newLayout) => {
    document.body.className = '';
    document.body.classList.add(`layout-${newLayout.toLowerCase()}`);
  },
  { immediate: true }
);

// Watch for changes in themeMode and automatically switch theme
watch(
  () => customizer.themeMode,
  (newMode) => {
    // Get the current base theme name (remove 'Dark' prefix if present)
    const currentTheme = customizer.actTheme;
    const baseThemeName = currentTheme.startsWith('Dark') ? currentTheme.replace('Dark', '') : currentTheme;
    
    // Apply the new theme based on the mode
    const newThemeName = newMode === 'dark' ? `Dark${baseThemeName}` : baseThemeName;
    customizer.SET_THEME(newThemeName);
  }
);

// Watch for changes in menuOrientation and apply layout changes
watch(
  () => customizer.menuOrientation,
  (newOrientation) => {
    document.body.classList.remove('menu-vertical', 'menu-horizontal');
    document.body.classList.add(`menu-${newOrientation}`);
    
    if (newOrientation === 'horizontal') {
      customizer.SET_LAYOUT_TYPE('NavBar');
    } else {
      customizer.SET_LAYOUT_TYPE('SideBar');
      // Force re-render of layout elements without page reload
      setTimeout(() => {
        // Force sidebar to re-render by toggling its state
        customizer.Sidebar_drawer = false;
        setTimeout(() => {
          customizer.Sidebar_drawer = true;
        }, 50);
      }, 100);
    }
  }
);

function clearOption() {
  customizer.inputBg = false;
  customizer.fontTheme = 'vazir';
  customizer.actTheme = 'PurpleTheme';
  customizer.layoutType = 'SideBar';
  customizer.themeMode = 'light';
}

function getFontDisplayName(font: string): string {
  const fontNames: Record<string, string> = {
    vazir: 'بانک پارسیان',
    yekanLight: 'بانک پارسیان',
    iranSans: 'بانک پارسیان',
    kalamehLight: 'بانک پارسیان',
    IranNastaliq: 'بانک پارسیان',
    Massir: 'بانک پارسیان'
  };
  return fontNames[font] || font;
}

// Function to validate current customizer settings
function validateCurrentSettings() {
  // Validate current settings in the store
  customizer.fontTheme = validateFontTheme(customizer.fontTheme);
  customizer.inputBg = validateInputBg(customizer.inputBg);
  customizer.layoutType = validateLayoutType(customizer.layoutType);
  customizer.actTheme = validateTheme(customizer.actTheme);
  customizer.themeMode = validateThemeMode(customizer.themeMode);
}

// Validate settings when component mounts
onMounted(() => {
  validateCurrentSettings();
});
</script>

<template>
  <v-navigation-drawer app temporary elevation="10" location="left" v-model="customizer.Customizer_drawer" width="400">
    <perfect-scrollbar style="height: 100%">
      <v-col cols="12" class="pa-0">
        <div class="pa-5 d-flex justify-space-between align-center">
          <div class="text-h6 font-weight-medium">شخصی سازی</div>
          <div>
            <v-btn color="error" variant="outlined" size="small" class="ml-2" @click="clearOption">بارنشانی</v-btn>
            <v-btn
              variant="text"
              color="lightText"
              icon="$close"
              density="compact"
              @click.stop="customizer.SET_CUSTOMIZER_DRAWER(!customizer.Customizer_drawer)"
            ></v-btn>
          </div>
        </div>
      </v-col>

      <v-card>
        <v-tabs v-model="tab" bg-color="lightprimary" align-tabs="center" fixed-tabs color="primary">
          <v-tab  value="style">ظاهر</v-tab>
          <v-tab  value="font">فونت</v-tab>
        </v-tabs>

        <v-card-text>
          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="style">
              <div class="pa-4">
                <!-- THEME MODE -->
                <ToggleSwitch
                  v-model="customizer.themeMode"
                  label="حالت روز / شب"
                  type="string"
                  activeColor="#38468c"
                  inactiveColor="#f2e44d"
                  :options="[
                    { value: 'light', label: 'روز', icon: IconSun },
                    { value: 'dark', label: 'شب', icon: IconMoon }
                  ]"
                  @update:model-value="customizer.SET_THEME_MODE($event as 'light' | 'dark')"
                />

                <!-- PRESET COLOR -->
                <div class="mb-6">
                  <h6 class="text-subtitle-1 font-weight-medium mb-3">رنگ بندی</h6>
                  <div class="custom-theme-colors">
                    <div
                      v-for="color in colorPalette"
                      :key="color.themeName"
                      :class="['color-option', { selected: customizer.actTheme === getCurrentThemeName(color.themeName) }]"
                      :style="{ background: `conic-gradient(${color.primary} 50%, ${color.secondary} 50%)` }"
                      @click="selectTheme(color.themeName)"
                    >
                    </div>
                  </div>
                </div>

<!--                &lt;!&ndash; INPUT BACKGROUND &ndash;&gt;-->
<!--                <div class="mb-6">-->
<!--                  <h6 class="text-subtitle-1 font-weight-medium mb-3">INPUT BACKGROUND</h6>-->
<!--                  <div class="d-flex gap-2">-->
<!--                    <v-btn-->
<!--                      variant="outlined"-->
<!--                      :color="!customizer.inputBg ? 'primary' : 'grey'"-->
<!--                      @click="customizer.inputBg = false"-->
<!--                      class="flex-1"-->
<!--                    >-->
<!--                      <div class="input-preview bg-white border"></div>-->
<!--                      Default-->
<!--                    </v-btn>-->
<!--                    <v-btn-->
<!--                      variant="outlined"-->
<!--                      :color="customizer.inputBg ? 'primary' : 'grey'"-->
<!--                      @click="customizer.inputBg = true"-->
<!--                      class="flex-1"-->
<!--                    >-->
<!--                      <div class="input-preview bg-grey-lighten-4 border"></div>-->
<!--                      Filled-->
<!--                    </v-btn>-->
<!--                  </div>-->
<!--                </div>-->

<!--                &lt;!&ndash; LAYOUT TYPE &ndash;&gt;-->
<!--                <div class="mb-6">-->
<!--                  <h6 class="text-subtitle-1 font-weight-medium mb-3">LAYOUT TYPE</h6>-->
<!--                  <div class="d-flex gap-2">-->
<!--                    <v-btn-->
<!--                      variant="outlined"-->
<!--                      :color="customizer.layoutType === 'SideBar' ? 'primary' : 'grey'"-->
<!--                      @click="customizer.SET_LAYOUT_TYPE('SideBar')"-->
<!--                      class="flex-1"-->
<!--                    >-->
<!--                      <div class="layout-preview sidebar-layout"></div>-->
<!--                      Sidebar-->
<!--                    </v-btn>-->
<!--                    <v-btn-->
<!--                      variant="outlined"-->
<!--                      :color="customizer.layoutType === 'NavBar' ? 'primary' : 'grey'"-->
<!--                      @click="customizer.SET_LAYOUT_TYPE('NavBar')"-->
<!--                      class="flex-1"-->
<!--                    >-->
<!--                      <div class="layout-preview navbar-layout"></div>-->
<!--                      Navbar-->
<!--                    </v-btn>-->
<!--                  </div>-->
<!--                </div>-->

              

                <!-- Menu Orientation -->
                <div class="mb-6 menu-orientation-section">
                  <h6 class="text-subtitle-1 font-weight-medium mb-3">انوع منو</h6>
                  <div class="d-flex gap-3">
                    <v-btn
                      variant="outlined"
                      :color="customizer.menuOrientation === 'vertical' ? 'secondary' : 'borderLight'"
                      @click="customizer.SET_MENU_ORIENTATION('vertical')"
                      class="flex-1 menu-orientation-btn"
                    >
                      <div class="sidebar-preview closed"></div>
                    </v-btn>
                    <v-btn
                      variant="outlined"
                      :color="customizer.menuOrientation === 'horizontal' ? 'secondary' : 'borderLight'"
                       @click="customizer.SET_MENU_ORIENTATION('horizontal')"
                      class="flex-1 menu-orientation-btn"
                    >
                      <div class="sidebar-preview open"></div>
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-tabs-window-item>

            <v-tabs-window-item value="font">
              <div class="pa-4">
                <h6 class="text-subtitle-1 font-weight-medium mb-4">انتخاب فونت</h6>
                <v-radio-group v-model="customizer.fontTheme" hide-details class="custom-font">
                  <v-radio
                    v-for="font in fontFamily"
                    :key="font"
                    :label="getFontDisplayName(font)"
                    :value="font"
                    color="primary"
                    class="mb-4 font-option"
                    :style="{ fontFamily: font }"
                    @click="customizer.SET_FONT(font)"
                  ></v-radio>
                </v-radio-group>
              </div>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>
      </v-card>
      <div class="d-flex py-5 align-center justify-center">
        <v-btn variant="tonal" color="primary" @click="setCustomizer">
          تایید
        </v-btn>
      </div>
    </perfect-scrollbar>
  </v-navigation-drawer>
  <v-snackbar v-if="snackbar" v-model="snackbar" :color="snackbarColor" timeout="2500">
    {{ snackbarMessage }}
  </v-snackbar>
</template>

<style lang="scss" scoped>
.custom-theme-colors {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: start;

  .color-option {
    width: 55px;
    height: 55px;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;
    transform: rotate(45deg);
    border: 2px solid beige;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      transform: scale(1.1) rotate(45deg);

      .color-tooltip {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }
    }

    &.selected {
      border: 3px solid var(--v-theme-primary);
      box-shadow: 0 0 0 3px rgba(var(--v-theme-primary), 0.3);

      &::after {
        content: '✔';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        color: white;
        font-size: 18px;
        font-weight: bold;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
      }
    }

    .color-tooltip {
      position: absolute;
      bottom: -45px;
      left: 50%;
      transform: translateX(-50%) translateY(5px) rotate(-45deg);
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 10;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
  }
}

.font-option {
  .v-selection-control__wrapper {
    padding: 10px 12px;
    border-radius: 8px;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: rgba(var(--v-theme-primary), 0.1);
    }
  }

  .v-selection-control--dirty .v-selection-control__wrapper {
    background-color: rgba(var(--v-theme-primary), 0.15);
  }
}

// Input Background Preview
.input-preview {
  width: 20px;
  height: 12px;
  border-radius: 2px;
  margin: 0 auto;
}

// Layout Preview
.layout-preview {
  width: 30px;
  height: 20px;
  border: 2px solid #ccc;
  border-radius: 3px;
  margin: 0 auto;
  position: relative;

  &.boxed-layout::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    border: 1px solid #ccc;
    border-radius: 1px;
  }

  &.full-layout::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    background: #1976d2;
    border-radius: 1px;
  }
}

// RTL Preview
.rtl-preview {
  width: 30px;
  height: 20px;
  border: 5px dashed #ccc;
  border-radius: 3px;
  margin: 0 auto;
  position: relative;

  &.ltr::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 4px;
    height: 16px;
    background: #1976d2;
    border-radius: 1px;
  }

  &.rtl::before {
    content: '';
    position: absolute;
    top: 2px;
    right: 2px;
    width: 4px;
    height: 16px;
    background: #1976d2;
    border-radius: 1px;
  }
}

// Sidebar Preview
.sidebar-preview {
  width: 45px;
  height: 30px;
  border: 2px dashed #777777;
  border-radius: 3px;
  margin: 0 auto;
  position: relative;

  &.closed::before {
    content: '';
    position: absolute;
    top: 2px;
    right: 2px;
    width: 6px;
    height: 23px;
    background: #027efb;
    border-radius: 1px;
  }

  &.open::before {
    content: '';
    position: absolute;
    top: 2px;
    right: 2px;
    width: 36px;
    height: 6px;
    background: #027efb;
    border-radius: 1px;
  }
}

// Menu Orientation Section - Wider styling
.menu-orientation-section {
  .menu-orientation-btn {
    min-height: 65px;
    padding: 5px 5px;
    border: 2px solid;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
    
    .sidebar-preview {
      width: 60px;
      height: 40px;
      
      &.closed::before {
        width: 8px;
        height: 32px;
      }
      
      &.open::before {
        width: 52px;
        height: 8px;
      }
    }
  }
}

// Menu Preview
.menu-preview {
  width: 30px;
  height: 20px;
  border: 2px dashed #464545;
  border-radius: 3px;
  margin: 0 auto;
  position: relative;

  &.vertical::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 4px;
    height: 16px;
    background: #1976d2;
    border-radius: 4px;
  }

  &.horizontal::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 4px;
    background: #1976d2;
    border-radius: 4px;
  }
}

.flex-1 {
  flex: 1;
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}

// Theme Toggle Styles
.theme-toggle-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
}

.theme-toggle {
  position: relative;
  width: 100px;
  height: 50px;
  background: rgb(var(--v-theme-primary));
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  &.dark-mode {
    background: #2c3e50;
    
    .toggle-slider {
      transform: translateX(50px);
      background: #000000;
    }
  }

  .toggle-slider {
    position: absolute;
    top: 5px;
    left: 5px;
    width: 40px;
    height: 40px;
    background: #ffffff;
    border-radius: 50%;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .toggle-icon {
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    color: #f39c12;
  }
}

.mb-6 {
  margin-bottom: 24px;
}

.mb-3 {
  margin-bottom: 12px;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>
