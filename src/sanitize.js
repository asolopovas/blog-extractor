const {JSDOM} = require('jsdom')
const createDOMPurify = require('dompurify');
const window = new JSDOM('').window;
const {sanitze} = require('../config')
const conf = sanitze

const DOMPurify = createDOMPurify(window);
DOMPurify.addHook('beforeSanitizeAttributes', function(node) {
  // Set text node content to uppercase
  if (node.nodeName && node.nodeName === 'H2') {

    const innerText = node.textContent
    const sentences = innerText.match(/[\w|\)][.?!](\s|$)/g)

    if (sentences && sentences.length > 1) {
      let pEl = window.document.createElement('p'); // Create a <h1> elemen
      pEl.innerHTML = node.innerHTML
      node.parentNode.replaceChild(pEl, node)
    }
  }
})


function sanitize(text) {
  return DOMPurify.sanitize(
    text.trim()
        .replace(/\r?\n|\r/g, '')
        .replace(/&nbsp;/g, ' ').trim(),
    conf)
}

module.exports = sanitize
