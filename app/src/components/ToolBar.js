import React, { Component } from 'react'

class ToolBar extends Component {

  render() {
    const { handleChange, interpreterSelect, displayCode, displayAST } = this.props;
    return (
      <div>
        <label htmlFor="interpreterSelect">
          Select an interpreter:
          <select name='interpreterSelect' onChange={handleChange} value={interpreterSelect}>
            <option value="schemy">Schemy</option>
            <option value="interpreter_infix_AST">Infix calculator - complete</option>
            <option value="interpreter_infix_first">Infix calculator - first version</option>
            <option value="interpreter_infix_correct">Infix calculator - correct OoP + parenthesis</option>
            <option value="interpreter_infix_incorrect">Infix calculator - incorrect OoP</option>
          </select>
        </label>
        <label htmlFor="displayCode">
          Display interpreter code:
          <input type="checkbox" name="displayCode" checked={displayCode} onChange={handleChange} />
        </label>
        <label htmlFor="displayAST">
          Display generated AST:
          <input type="checkbox" name="displayAST" checked={displayAST} onChange={handleChange} />
        </label>
      </div>
    )
  }
}

export default ToolBar;