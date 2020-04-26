let emptySchFile = {
  fileName: null,
  cells: [
    { num: ' ',
      input: '',
      output: [],
      result: '',
      error: '',
      ast: '' },
  ],
  totalNumber: 0,
  wholeProgTxt: '',
  fileType: 'sch',
  isSaved: false,
  id: null
};

let emptyJslFile = {
  fileName: null,
  cells: [
    { num: ' ',
      input: '',
      output: [],
      result: '',
      error: '',
      ast: '' },
  ],
  totalNumber: 0,
  wholeProgTxt: '',
  fileType: 'jsl',
  isSaved: false,
  id: null
};

export { emptySchFile, emptyJslFile }