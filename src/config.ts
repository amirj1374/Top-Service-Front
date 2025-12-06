import { OrangeTheme } from '@/theme/lightThemes/OrangeTheme';

export type ConfigProps = {
  Sidebar_drawer: boolean;
  Customizer_drawer: boolean;
  mini_sidebar: boolean;
  setHorizontalLayout: boolean;
  actTheme: string;
  boxed: boolean;
  fontTheme: string;
  inputBg: boolean;
  layoutType: string;
  loading: boolean;
};

const config: ConfigProps = {
  Sidebar_drawer: true,
  Customizer_drawer: false,
  mini_sidebar: false,
  setHorizontalLayout: false, // Horizontal layout
  actTheme: 'OrangeTheme',
  fontTheme: 'iranSans',
  layoutType: 'SideBar',
  inputBg: false,
  boxed: true,
  loading: false
};

export default config;
