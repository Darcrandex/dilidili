export enum EChannel {
  Debug = 'debug',

  Fetch = 'fetch',
  FetchLog = 'send-log-to-renderer',

  SelectDir = 'select-dir',

  DownloadBV = 'download-bilibili-video',
  GetBVInfo = 'get-bilibili-video-info',

  SetStore = 'set-store',
  GetStore = 'get-store',
  RemoveStore = 'remove-store',
  ClearStore = 'clear-store',
  StoreUpdated = 'store-updated',

  ReadDir = 'read-dir',
  ReadFile = 'read-file',
  OpenDir = 'open-dir',
  RemoveDir = 'remove-dir',

  OpenInBrowser = 'open-in-browser',

  OpenVideoInSystemPlayer = 'open-video-in-system-player',
}

export enum WindowControl {
  GetIsMaximized = 'get-is-maximized',
  ToggleMaximize = 'toggle-maximize',
  Minimize = 'minimize',
  Maximize = 'maximize',
  Close = 'close',
}

export enum ECommon {
  Referer = 'https://www.bilibili.com',
}

export enum EStorage {
  Session = 'SESSDATA',

  RootDir = 'rootDir',

  DownloadTasks = 'downloadTasks',
}

export enum ETaskStatus {
  Failed = 0,
  Downloading = 1,
  Mixing = 2,
  Finished = 3,
}
