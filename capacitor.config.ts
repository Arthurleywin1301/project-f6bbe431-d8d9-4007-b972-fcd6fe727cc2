import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.f6bbe431d8d94007b972fcd6fe727cc2",
  appName: "WWII Encyclopedia",
  webDir: "dist/client",
  server: {
    // Live-reload from your Lovable preview while developing.
    // Remove this `server` block before building a production APK
    // if you want the app to load fully bundled assets instead.
    url: "https://f6bbe431-d8d9-4007-b972-fcd6fe727cc2.lovableproject.com?forceHideBadge=true",
    cleartext: true,
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
