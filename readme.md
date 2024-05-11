<p align="center">
  <img alt="dilidili" src="resources/icon.png" width="100" />
</p>

<h1 align="center">bilibli + download = dilidili</h1>

> 一个下载哔哩哔哩 BV 视频的工具

> 参考
>
> [electron-vite](https://electron-vite.org/)
>
> [bilibili-API-collect](https://github.com/SocialSisterYi/bilibili-API-collect)

## 本地打包

```bash
pnpm install
pnpm run build:unpack
```

从 dist 文件夹中找到解压的免安装应用程序

## 从 release 下载

[下载地址](https://github.com/Darcrandex/dilidili/releases)

## 安装（或使用）过程中提示签名错误

由于该项目没有进行代码签名，导致使用时提示错误

- Windows 平台在安装过程中会提示“不受信任”，解决方法是依次单击：
  “更多信息”，“仍要运行”
- macos 平台安装完成后，使用终端执行以下代码，再重新打开应用即可
  ```bash
  sudo xattr -r -d com.apple.quarantine /Applications/dilidili.app
  ```
