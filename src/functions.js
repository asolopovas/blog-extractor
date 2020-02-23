const fs = require('fs')
const path = require('path')
const {JSDOM} = require('jsdom')
const axios = require('axios')
const {baseURL} = require('../config')
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
axios.defaults.baseURL = baseURL

async function getDom(url) {
  const {data} = await axios.get(url)
  return new JSDOM(data).window.document
}

function mkdir(dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }
}

async function download(url, dest, cb) {
  mkdir(path.dirname(dest))
  try {
    let writer = fs.createWriteStream(dest);
    const {data} = await axios.get(url, {responseType: 'stream'})
    data.pipe(writer);
    writer.on('finish', function() {
      writer.close(cb);  // close() is async, call cb after close completes.
    });
  } catch (error) {
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
  }
};
module.exports = {
  mkdir, download, getDom
}
