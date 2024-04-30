<p align="center">
  <img alt="dilidili" src="resources/icon.png" width="100" />
</p>

<h1 align="center">bilibli + download = dilidili</h1>

> 一个下载哔哩哔哩 BV 视频的工具

> 参考
>
> [electron-vite](https://electron-vite.org/)

## 本地打包

```bash
pnpm install
pnpm run build:unpack
```

从 dist 文件夹中找到解压的免安装应用程序

## 从 release 下载

[下载地址](https://github.com/Darcrandex/dilidili/releases)

> 安装时提示签名错误问题

由于目前做签名处理，导致安装时会提示不受信任

- Windows：点击 仍信任
- MacOS：打开终端运行 `sudo xattr -r -d com.apple.quarantine /Applications/dilidili.app`
