import { EChannel, EStorage } from '@main/enums'

export const taskService = {
  getTasks: async () => {
    const tasks: MainProcess.DownloadTask[] = await window.electron.ipcRenderer.invoke(
      EChannel.GetStore,
      EStorage.DownloadTasks
    )
    return tasks
  },

  createTask: async (params: MainProcess.DownloadBVParams) => {
    await window.electron.ipcRenderer.invoke(EChannel.DownloadBV, params)
  },

  removeTask: async (id: string) => {
    const prevTasks: MainProcess.DownloadTask[] = await window.electron.ipcRenderer.invoke(
      EChannel.GetStore,
      EStorage.DownloadTasks
    )
    const updatedTasks = (prevTasks || []).filter((task) => task.id !== id)
    await window.electron.ipcRenderer.invoke(EChannel.SetStore, { [EStorage.DownloadTasks]: updatedTasks })
  },

  clearTasks: async () => {
    await window.electron.ipcRenderer.invoke(EChannel.SetStore, { [EStorage.DownloadTasks]: [] })
  }
}
