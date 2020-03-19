import React, { useState } from 'react';
import { css } from 'emotion';
import AceEditor from 'react-ace';

const baseClassic = css`width: 95%;
height: 100%;
border-radius: 4px;
margin: 0 auto;
box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
`
const EditorClassic = ({fileData}) => {
  const [value, setValue] = useState(fileData.wholeProgTxt);
  const handleChange = newValue => setValue(newValue);
  return (
    <div className={baseClassic}>
      <AceEditor
        mode="javascript"
        theme="monokai"
        onChange={handleChange}
        value={value}
        name="input_editor"
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        editorProps={{ $blockScrolling: true }}
        readOnly={false}
        width={'400px'}
      />
      <p>
        {fileData.cells[0].input}
      </p>
    </div>
  )
}


export default EditorClassic;