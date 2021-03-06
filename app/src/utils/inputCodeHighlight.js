import hljs from 'highlight.js/lib/core';
import scheme from 'highlight.js/lib/languages/scheme';
import javascript from 'highlight.js/lib/languages/javascript';

import parse from 'html-react-parser';

const shouldSkip = (hCode, i) => {
  let offset = 0;
  for (let j = 0; j < i; j++) {
    if (hCode[j].length > 1) offset += hCode[j].length -1;
  }
  i += offset;
  hCode = hCode.join('');
  const enclosingStringSpan = hCode.lastIndexOf("<span class=\"hljs-string\">", i);
  const enclosingCommentSpan = hCode.lastIndexOf("<span class=\"hljs-comment\">", i);
  const closingSpan = hCode.lastIndexOf("</span>", i);
  const likelyChar = (hCode[i-1] === '\\' && hCode[i-2] === '#');
  return enclosingStringSpan > closingSpan | enclosingCommentSpan > closingSpan | likelyChar;
}

const bracketColorizer = (hCode, code, caretPos) => {
  let stackArr = [];
  let pairRangeArr = [];
  let level = 0;
  let maxLevel = 3;
  const bracketRegex = /[\[\]\(\)\{\}]/g;
  const openRegex = /[\[\(\{]/;
  const closeRegex = /[\]\)\}]/;
  const bracketMap = {']':'[', ')':'(', '}':'{'};
  let resultArr = [ ...hCode.matchAll(bracketRegex)];
  let resultCleanArr = [ ...code.matchAll(bracketRegex)];
  // console.log(resultCleanArr, resultArr)
  hCode = hCode.split('');
  for (let i = 0; i < resultArr.length; i++) {
    if (openRegex.test(resultArr[i][0]) && !shouldSkip(hCode, resultArr[i].index)) {
      resultArr[i].arrayIndex = i;
      stackArr.push(resultArr[i]);
      hCode.splice(resultArr[i].index, 1, `<span class='bracket-${level}'>${resultArr[i][0]}</span>`)
      level++;
      if (level > maxLevel) level = 0;
    }
    else if (closeRegex.test(resultArr[i][0]) && !shouldSkip(hCode, resultArr[i].index)) {
      let openingBracket = stackArr.pop();
      if (openingBracket && (bracketMap[resultArr[i][0]] === openingBracket[0])) {
        level--;
        if (level < 0) level = maxLevel;
        hCode.splice(resultArr[i].index, 1, `<span class='bracket-${level}'>${resultArr[i][0]}</span>`);
        pairRangeArr.push([[resultCleanArr[openingBracket.arrayIndex].index, resultCleanArr[i].index], [openingBracket.index, resultArr[i].index]]);
      }
      else {
        hCode.splice(resultArr[i].index, 1, `<span class='bracket-error'>${resultArr[i][0]}</span>`)
        break;
      }
    }
  }
  // console.log(pairRangeArr);
  if (caretPos > 0) {
    for (let i = 0; i < pairRangeArr.length; i++) {
      if (pairRangeArr[i][0][0] < caretPos && caretPos < pairRangeArr[i][0][1]+1) {
        const newOpenBracketTag = hCode[pairRangeArr[i][1][0]].slice(0,13) + 'bracket-active ' + hCode[pairRangeArr[i][1][0]].slice(13);
        const newCloseBracketTag = hCode[pairRangeArr[i][1][1]].slice(0,13) + 'bracket-active ' + hCode[pairRangeArr[i][1][1]].slice(13);
        hCode.splice(pairRangeArr[i][1][0], 1, newOpenBracketTag);
        hCode.splice(pairRangeArr[i][1][1], 1, newCloseBracketTag);
        break;
      }
    }

  }
  return hCode.join('');
}
// 0: (2) [[0, 12], [0, 34]]
// 1: (2) [14, 24]
// 2: (2) [34, 43]
// 3: (2) [46, 56]
// 4: (2) [63, 70]
// 5: (2) [84, 92]
// 6: (2) [59, 93]
// 7: (2) [26, 94]
export default (code, caretPos, lang) => {
  if (lang === 'sch') lang = 'scheme';
  else lang = 'javascript'
  hljs.registerLanguage('scheme', scheme);
  hljs.registerLanguage('javascript', javascript);
  const colorizedBracektCode = bracketColorizer(hljs.highlight(lang, code, true).value, code, caretPos)
  return parse(colorizedBracektCode);
}