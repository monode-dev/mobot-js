export const mobot = {
  app: (config: { name: string, bundleId: string }) => {
    (window as any).mobotConfig = config;
  },
} as const;
