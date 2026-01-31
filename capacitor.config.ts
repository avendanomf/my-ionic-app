import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Insucalc',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
    }
  }
};

export default config;
