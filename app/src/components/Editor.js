import React, { Component } from 'react'
import AceEditor from 'react-ace'

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-monokai";


class Editor extends Component {
  state = { value: 'testytets' }

  // onChange = (newValue) => {
  //   // console.log("change", newValue);
  //   this.setState({
  //     value: newValue
  //   })
  // }
  render() {
    return (
      <AceEditor
        mode="javascript"
        theme="monokai"
        onChange={this.props.handleChange}
        value={this.props.value}
        name="input_editor"
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        editorProps={{ $blockScrolling: true }}
        readOnly={this.props.readOnly}
        width={this.props.width || '400px'}
      />
    )
  }
}

export default Editor;
