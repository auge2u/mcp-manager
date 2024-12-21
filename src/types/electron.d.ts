export interface IElectronAPI {
  readConfig: () => Promise<unknown>
  executeCommand: (command: string) => Promise<{ success: boolean; output: string }>
}

declare global {
  interface Window {
    electron: IElectronAPI
  }
}
