import React, { Component } from 'react'
import Header from './Header'
import Editor from './Editor'
import '../css/EditorArea.css'

import interpreter_schemy from '../interpreters/shemy.js'
import schemy_text from '../interpreters/shemy_text.js'

import interpreter_infix_AST from '../interpreters/AST_construction.js'
import interpreter_infix_AST_text from '../interpreters/AST_construction_text.js'

import interpreter_infix_correct from '../interpreters/parenth_exps.js'
import interpreter_infix_correct_text from '../interpreters/parenth_exps_text.js'

import interpreter_infix_incorrect from '../interpreters/all_exps.js'
import interpreter_infix_incorrect_text from '../interpreters/all_exps_text.js'

import interpreter_infix_first from '../interpreters/first_infix_calc.js'
import interpreter_infix_first_text from '../interpreters/first_infix_calc_text.js'

const program_texts = { schemy_text, interpreter_infix_AST_text, interpreter_infix_correct_text, interpreter_infix_incorrect_text, interpreter_infix_first_text }


class EditorArea extends Component {

  state = {
    interpreterSelect: 'schemy',
    displayCode: false,
    displayAST: false,
    inputEditorValue: '',
    outputEditorValue: '',
    astEditorValue: '',
    codeEditorValue: schemy_text
  }

  handleToolBarChange = ({ target }) => {

    const value = target.type === 'checkbox' ? target.checked : target.value;
    const program_text = target.name === 'interpreterSelect' ? program_texts[`${target.value}_text`] : this.state.codeEditorValue
    this.setState({
      [target.name]: value,
      codeEditorValue: program_text
    })
  }

  handleInputEditorChange = (newVal) => {
    this.setState({
      inputEditorValue: newVal
    })
  }

  handleClickRun = () => {
    const interpreter = this.state.interpreterSelect;
    const input = this.state.inputEditorValue;
    console.log(input);

    let res;
    if (interpreter === 'schemy') res = interpreter_schemy(input)
    else if (interpreter === 'interpreter_infix_AST') res = interpreter_infix_AST(input)
    else if (interpreter === 'interpreter_infix_correct') res = interpreter_infix_correct(input)
    else if (interpreter === 'interpreter_infix_incorrect') res = interpreter_infix_incorrect(input)
    else if (interpreter === 'interpreter_infix_first') res = interpreter_infix_first(input)
    console.log("im here", res.output)


    this.setState({
      outputEditorValue: `${res.output}`,
      astEditorValue: JSON.stringify(res.ast, null, 1)
    })
  }

  render() {
    const { interpreterSelect, displayCode, displayAST, inputEditorValue, outputEditorValue, astEditorValue, codeEditorValue } = this.state;
    return (
      <div>
        <Header interpreterSelect={interpreterSelect} displayAST={displayAST} displayCode={displayCode} handleChange={this.handleToolBarChange} />
        <button className='btn run-btn' onClick={this.handleClickRun}>RUN!</button>
        <Examples inter={interpreterSelect} />
        <div className='editorContainer'>
          <div>
            <p>Input program</p>
            <Editor value={inputEditorValue} handleChange={this.handleInputEditorChange} />
          </div>
          <div>
            <p>Output</p>
            <Editor readOnly={true} value={outputEditorValue} width='250px' />
          </div>
          {displayCode ?
            <div>
              <p>Interpreter Source Code</p>
              <Editor readOnly={true} value={codeEditorValue} width='800px' />
            </div>
            : null
          }
          {displayAST ?
            <div>
              <p>Generated AST</p>
              <Editor readOnly={true} value={astEditorValue} />
            </div>
            : null
          }
        </div>
      </div>
    )
  }
}

const Examples = (props) => {
  const program_texts = {
    schemy: ["(+ 2 4)", "(begin (define r 10) (* PI (* r r)))"],
    interpreter_infix_AST: ["(((8) * 2)) + 5 * (2) + 100", "7 + 3 * (10 / (12 / (3 + 1) - 1)) / (2 + 3) - 5 - 3 + (8)", "7 + 3"],
    interpreter_infix_correct: ["(((8) * 2)) + 5 * (2) + 100", "7 + 3 * (10 / (12 / (3 + 1) - 1)) / (2 + 3) - 5 - 3 + (8)", "7 + 3"],
    interpreter_infix_incorrect: ["8 + 2 * 10", "2 * 10 + 8"],
    interpreter_infix_first: ["3 + 4"]
  }

  return (
    <div style={{ textAlign: "left", marginLeft: "2em" }}>
      Examples:
      <ul>
        {program_texts[props.inter].map(ex => (<li>{ex}</li>))}
      </ul>
    </div>
  )
}

export default EditorArea;