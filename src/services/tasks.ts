import { EChannel, EStorage } from '@electron/enums'

export const taskService = {
  getTasks: async () => {
    const tasks: MainProcess.DownloadTask[] = await window.ipcRenderer.invoke(EChannel.GetStore, EStorage.DownloadTasks)
    return tasks
  },

  createTask: async (params: MainProcess.DownloadBVParams) => {
    await window.ipcRenderer.invoke(EChannel.DownloadBV, params)
  },

  removeTask: async (id: string) => {
    const prevTasks: MainProcess.DownloadTask[] = await window.ipcRenderer.invoke(
      EChannel.GetStore,
      EStorage.DownloadTasks,
    )
    const updatedTasks = (prevTasks || []).filter((task) => task.id !== id)
    await window.ipcRenderer.invoke(EChannel.SetStore, { [EStorage.DownloadTasks]: updatedTasks })
  },

  clearTasks: async () => {
    await window.ipcRenderer.invoke(EChannel.SetStore, { [EStorage.DownloadTasks]: [] })
  },
}
