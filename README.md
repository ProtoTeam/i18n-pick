# i18n-pick
提取jsx项目中的中文文案

具体使用参照掘金文章 [5分钟前端国际化](https://juejin.im/post/59eed7df518825469c747c14)

### 安装

`cnpm i i18n-pick`

### 扫描

`./node_modules/i18n-pick/bin/i18n-pick.js scan [path]`

### 提取

`./node_modules/i18n-pick/bin/i18n-pick.js pick`

### 导出

`./node_modules/i18n-pick/bin/i18n-pick.js export`

### 配置

i18n.config.json
```js
{
  // 引用语句
  "importStatement": "import { I18N } from '@common/I18N';",
  // 调用语句
  "callStatement": "I18N.get",
  // 语言文件目标目录
  "targetDir": "i18n-messages",
  // 不予扫描的文件，遵循 glob
  "exclude": [
    "**/demo.{js,jsx}"
  ]
}
```
