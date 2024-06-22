export const mobot = {
  app: (config: { message: string }) => {
    (window as any).iacConfig = {
      message: `Hello ${config.message} from Mobot in the web!`,
    };
  },
} as const;
