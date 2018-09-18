# i18n-pick
提取react项目中的中文文案，目前已支持typescript

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
  ],
  // 是否统计函数参数中的中文
  "callExpression": false,
  // 自动中文做key
  "autoZhKey": true,
}
```

### 更新
### 1.7.0
 - fix 导出的zh-CH.json的'key'为id，为了直接能运行atool-l10n

### 1.6.0
 - 支持 typescript 文件扫描
 - 中文默认为key，默认不统计函数参数中的中文
 - 开放配置

### 贡献者
多谢以下贡献者：

 - [AceLeeWinnie](https://github.com/AceLeeWinnie)