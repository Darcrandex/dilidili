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

  OpenInBrowser = 'open-in-browser',
}

export enum ECommon {
  Referer = 'https://www.bilibili.com',
}

export enum EStorage {
  Session = 'SESSDATA',

  RootDir = 'rootDir',

  DownloadTasks = 'downloadTasks',
}
