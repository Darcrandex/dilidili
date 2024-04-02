export const uuid = (len = 4) => Math.random().toString(36).slice(-len)

export const sleep = (time = 1000) => new Promise((resolve) => setTimeout(resolve, time))
