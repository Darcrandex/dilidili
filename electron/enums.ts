// 枚举

export enum HandleChannel {
  // store
  SetStore = 'set-store',
  GetStore = 'get-store',
  RemoveStore = 'remove-store',
  ClearStore = 'clear-store',
  GetAllStore = 'get-all-store',

  // fetch
  Fetch = 'bilibili-fetch',

  // download
  DownloadBV = 'download-bilibili-video',

  // common
  SelectDir = 'select-dir',
}
