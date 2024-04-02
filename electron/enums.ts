export enum EChannel {
  Debug = 'debug',

  Fetch = 'fetch',

  SelectDir = 'select-dir',

  DownloadBV = 'download-bilibili-video',

  SetStore = 'set-store',
  GetStore = 'get-store',
  RemoveStore = 'remove-store',
  ClearStore = 'clear-store',
}

export enum ECommon {
  Referer = 'https://www.bilibili.com',
}

export enum EStorage {
  Session = 'SESSDATA',

  RootDir = 'rootDir',
}
