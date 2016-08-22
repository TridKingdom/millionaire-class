'use strict';

const fs = require('fs');
const path = require('path');
const basePath = path.join(__dirname, '../');
const targetPath = path.join(basePath, 'css/app/templates/questions');
const ext = '.scss';

const fileNames = ['qcac', 'qiac', 'qvac', 'qaac', 'qcai', 'qcan', 'qian', 'qvan', 'qaan'];

fileNames.forEach(function(item) {
  const filePath = path.join(targetPath, item + ext);
  let text =
  `.tk-millionarie-class .${item} {}`;

  fs.openSync(filePath, 'w');

  fs.writeFile(filePath, text, function (err) {
    if (err) throw err;
  });

  console.log(`[FILE CREATED] ${filePath}`);
});
