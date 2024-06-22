export const mobot = {
  app: () => {
    (window as any).iacConfig = { message: `Hello from Mobot in the web!` };
  },
} as const;
