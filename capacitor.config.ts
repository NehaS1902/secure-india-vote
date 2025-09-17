import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.eecd8597c5d94ccf92ea4bd27f25fecd',
  appName: 'secure-india-vote',
  webDir: 'dist',
  server: {
    url: 'https://eecd8597-c5d9-4ccf-92ea-4bd27f25fecd.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    // Biometric authentication will be handled by custom implementation
    // Add native plugins here when deploying to mobile devices
  }
};

export default config;