import hljs from 'highlight.js/lib/core';
import scheme from 'highlight.js/lib/languages/scheme';

import parse from 'html-react-parser';

export default (code) => {
  hljs.registerLanguage('scheme', scheme)
  return parse(hljs.highlight('scheme', code, true).value);
}