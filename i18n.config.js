
const _config = {
  "importStatement": "import { I18N } from '@common/I18N';",
  "callStatement": "I18N.get",
  "targetDir": "i18n-messages",
  "exclude": []
}
const path = require('path');
module.exports = function () {
  let config = {};
  try {
    config = require(path.join(process.cwd(), 'i18n.config.json'));
  } catch(e) {
    config = {};
  }
  return Object.assign({}, _config, config);
}
