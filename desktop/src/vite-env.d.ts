export {};

declare global {
  interface Window {
    electronAPI: {
      readDirectory: (path: string) => any;
    };
  }
}