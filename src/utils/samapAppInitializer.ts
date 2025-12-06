import { api } from '@/services/api';
import { useBaseStore } from '@/stores/base';
import { useCustomerInfoStore } from '@/stores/customerInfo';
import { useCustomizerStore } from '@/stores/customizer';
import type { CollateralDto, CurrenciesDto, DepartmentLevelDto, RegionsDto } from '@/types/approval/approvalType';
import type { AppInitializationResult } from './appInitializer';
import { AppInitializer } from './appInitializer';

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
] as const;

const validLayoutTypes = ['SideBar', 'NavBar'] as const;
const validFontThemes = ['vazir', 'yekanLight', 'iranSans', 'kalamehLight'] as const;
const validThemeModes = ['light', 'dark'] as const;

const validateTheme = (theme: string): string => {
  return validThemes.includes(theme as (typeof validThemes)[number]) ? theme : 'PurpleTheme';
};

const validateLayoutType = (layout: string): string => {
  return validLayoutTypes.includes(layout as (typeof validLayoutTypes)[number]) ? layout : 'SideBar';
};

const validateFontTheme = (font: string): string => {
  return validFontThemes.includes(font as (typeof validFontThemes)[number]) ? font : 'vazir';
};

const validateThemeMode = (mode: string): string => {
  return validThemeModes.includes(mode as (typeof validThemeModes)[number]) ? mode : 'light';
};

const validateInputBg = (inputBg: boolean): boolean => {
  return typeof inputBg === 'boolean' ? inputBg : false;
};

type BaseDataPayload = {
  currencies: CurrenciesDto[];
  collaterals: CollateralDto[];
  regions: RegionsDto[];
  departmentLevel: DepartmentLevelDto[];
};

const baseDataCache: {
  promise: Promise<BaseDataPayload> | null;
  data: BaseDataPayload | null;
} = {
  promise: null,
  data: null
};

const applyBaseDataToStore = (baseStore: ReturnType<typeof useBaseStore>, data: BaseDataPayload) => {
  baseStore.setCurrencyList(data.currencies);
  baseStore.setCollateralList(data.collaterals);
  baseStore.setRegionsList(data.regions);
  baseStore.setDepartmentLevel(data.departmentLevel);
};

const BASE_DATA_STAGGER_DELAY = 0;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const loadBaseDataSequential = async (baseStore?: ReturnType<typeof useBaseStore>): Promise<BaseDataPayload> => {
  const payload: BaseDataPayload = {
    currencies: [],
    collaterals: [],
    regions: [],
    departmentLevel: []
  };

  const log = (message: string) => {
    if (import.meta.env.DEV) {
      console.log(`[SamapAppInitializer] ${message}`);
    }
  };

  log('Fetching currencies');
  const currencyResponse = await api.approval.fetchCurrencies();
  payload.currencies = currencyResponse.data;
  if (baseStore) {
    baseStore.setCurrencyList(payload.currencies);
  }

  if (BASE_DATA_STAGGER_DELAY > 0) {
    await delay(BASE_DATA_STAGGER_DELAY);
  }

  log('Fetching collateral');
  const collateralResponse = await api.approval.getCollateral();
  payload.collaterals = collateralResponse.data;
  if (baseStore) {
    baseStore.setCollateralList(payload.collaterals);
  }

  if (BASE_DATA_STAGGER_DELAY > 0) {
    await delay(BASE_DATA_STAGGER_DELAY);
  }

  log('Fetching regions');
  const regionsResponse = await api.approval.getRegions();
  payload.regions = regionsResponse.data;
  if (baseStore) {
    baseStore.setRegionsList(payload.regions);
  }

  if (BASE_DATA_STAGGER_DELAY > 0) {
    await delay(BASE_DATA_STAGGER_DELAY);
  }

  log('Fetching department level');
  const departmentLevelResponse = await api.user.getDepartmentsLevel();
  payload.departmentLevel = departmentLevelResponse.data;
  if (baseStore) {
    baseStore.setDepartmentLevel(payload.departmentLevel);
  }

  baseDataCache.data = payload;
  return payload;
};

const fetchBaseData = async (baseStore?: ReturnType<typeof useBaseStore>): Promise<BaseDataPayload> => {
  if (baseDataCache.data) {
    if (baseStore) {
      applyBaseDataToStore(baseStore, baseDataCache.data);
    }
    return baseDataCache.data;
  }

  if (!baseDataCache.promise) {
    baseDataCache.promise = loadBaseDataSequential(baseStore).catch((error) => {
      baseDataCache.promise = null;
      throw error;
    });
  } else if (baseStore) {
    baseDataCache.promise
      .then((data) => applyBaseDataToStore(baseStore, data))
      .catch(() => {
        // errors handled in the original promise path
      });
  }

  return baseDataCache.promise;
};

const primeBaseData = (baseStore: ReturnType<typeof useBaseStore>) => {
  void fetchBaseData(baseStore).catch((error) => {
    if (import.meta.env.DEV) {
      console.error('[SamapAppInitializer] Failed to preload base data', error);
    }
  });
};

export const ensureBaseDataLoaded = async () => {
  const baseStore = useBaseStore();
  const data = await fetchBaseData(baseStore);
  return data;
};

class SamapAppInitializer extends AppInitializer {
  constructor() {
    super();
  }

  protected override async runInitialization(): Promise<AppInitializationResult> {
    if (import.meta.env.DEV) {
      console.log('[SamapAppInitializer] runInitialization start');
    }
    const customerInfoStore = useCustomerInfoStore();
    const customizerStore = useCustomizerStore();
    const baseStore = useBaseStore();

    customizerStore.SET_LOADING(true);
    customerInfoStore.clearError();

    if (import.meta.env.DEV) {
      console.log('[SamapAppInitializer] Fetching user info');
    }
    const userInfo = await api.user.getUserInfo();
    customerInfoStore.setUserInfo(userInfo.data);

    if (userInfo.data.customizer) {
      const { customizer } = userInfo.data;
      customizerStore.actTheme = validateTheme(customizer.actTheme);
      customizerStore.fontTheme = validateFontTheme(customizer.fontTheme);
      customizerStore.inputBg = validateInputBg(customizer.inputBg);
      customizerStore.themeMode = validateThemeMode(customizer.themeMode);
      customizerStore.layoutType = validateLayoutType(customizer.layoutType || 'SideBar');
    }

    primeBaseData(baseStore);

    if (import.meta.env.DEV) {
      console.log('[SamapAppInitializer] runInitialization completed');
    }
    return userInfo.data as AppInitializationResult;
  }

  protected override handleInitializationError(error: unknown): void {
    const customerInfoStore = useCustomerInfoStore();
    const message = error instanceof Error ? error.message : 'Failed to load application data';
    customerInfoStore.setError(message);
    super.handleInitializationError(error);
  }

  protected override onInitializationFinally(): void {
    const customizerStore = useCustomizerStore();
    customizerStore.SET_LOADING(false);
  }
}

const samapAppInitializer = new SamapAppInitializer();

export const initializeApp = () => samapAppInitializer.initializeApp();
export const startInitialization = () => samapAppInitializer.startInitialization();
export const isAppInitialized = () => samapAppInitializer.isAppInitialized();
export const waitForInitialization = () => samapAppInitializer.waitForInitialization();
export const reinitializeApp = () => samapAppInitializer.reinitialize();

