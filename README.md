# i18n-pick
提取jsx项目中的中文文案

# 在 https://github.com/ProtoTeam/i18n-pick 项目的基础上，修改了扫描生成的zh-CH.json的id的值和替换js jsx 文件里中文文本的逻辑

# 安装依赖：
cnpm i i18n-pick
cnpm i atool-l10n
## 扫描
./node_modules/i18n-pick/bin/i18n-pick.js scan [path]
## 提取
./node_modules/i18n-pick/bin/i18n-pick.js pick
## 翻译
node_modules/.bin/atool-l10n
