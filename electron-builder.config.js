/* eslint-disable no-undef */
module.exports = {
  appId: 'com.darcrand.dilidili',
  asar: true,
  directories: {
    output: 'release',
  },
  extraResources: 'follow', // 禁用软链接
  files: ['dist-electron', 'dist'],
  mac: {
    target: 'dmg',
    asarUnpack: ['**/*.app'],
    artifactName: '${productName}_${version}.${ext}',
  },
  win: {
    target: ['portable'],
    artifactName: '${productName}_${version}.${ext}',
  },

  publish: {
    provider: 'github',
    owner: 'Darcrandex',
    repo: 'dilidili',
    releaseType: 'draft',
    vPrefixedTagName: true,
  },
}
