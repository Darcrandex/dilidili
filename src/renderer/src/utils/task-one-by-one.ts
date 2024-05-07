export function taskOneByOne(tasks: (() => Promise<any>)[]) {
  return tasks.reduce((p, c) => p.then(c), Promise.resolve())
}
