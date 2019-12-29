import React, { Component } from 'react'

import '../css/ToolBar.css'

class ToolBar extends Component {

  render() {
    const { handleChange, interpreterSelect, displayCode, displayAST } = this.props;
    return (
      <div className="toolbarContainer">
        <label className="item" htmlFor="interpreterSelect">
          Select an interpreter:
          <select className='item-innerInteractive' name='interpreterSelect' onChange={handleChange} value={interpreterSelect}>
            <option value="schemy">Schemy</option>
            <option value="interpreter_infix_AST">Infix calculator - complete</option>
            <option value="interpreter_infix_first">Infix calculator - first version</option>
            <option value="interpreter_infix_correct">Infix calculator - correct OoP + parenthesis</option>
            <option value="interpreter_infix_incorrect">Infix calculator - incorrect OoP</option>
          </select>
        </label>
        <label className="item" htmlFor="displayCode">
          Display interpreter code:
          <input className='item-innerInteractive' type="checkbox" name="displayCode" checked={displayCode} onChange={handleChange} />
        </label>
        <label className="item" htmlFor="displayAST">
          Display generated AST:
          <input className='item-innerInteractive' type="checkbox" name="displayAST" checked={displayAST} onChange={handleChange} />
        </label>
      </div>
    )
  }
}

export default ToolBar;