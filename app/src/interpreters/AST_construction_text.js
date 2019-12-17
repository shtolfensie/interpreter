let text = 'const EOF = \"EOF\",\r\n  NUM = \"NUM\",\r\n  PLUS = \"PLUS\",\r\n  MINUS = \"MINUS\",\r\n  DIVIDED = \"DIVIDED\",\r\n  TIMES = \"TIMES\",\r\n  LPAREN = \"LPAREN\",\r\n  RPAREN = \"RPAREN\";\r\n\r\n\r\nconst OpNode = (left, op, right) => {\r\n  return { left, token: op, op: op.type, right, nodeType: \'OpNode\' }\r\n}\r\n\r\nconst NumNode = (token) => {\r\n  return { token, value: token.value, nodeType: \'NumNode\' }\r\n}\r\n\r\nconst Parser = program => {\r\n  let program_full = program.split(\"\");\r\n  program = program.split(\"\").filter(c => (c !== \" \" ? true : false));\r\n  let pos = 0;\r\n  let curr_token = \"\";\r\n\r\n  const get_next_token = () => {\r\n    if (pos > program.length - 1) return { type: EOF, value: null };\r\n\r\n    let cur_char = program[pos];\r\n\r\n    if (isNumber(cur_char)) {\r\n      return getNumber(cur_char);\r\n\r\n      \/\/ return { type: NUM, value: parseInt(cur_char) };\r\n    } else if (cur_char === \"+\") {\r\n      advance();\r\n      return { type: PLUS, value: cur_char };\r\n    } else if (cur_char === \"-\") {\r\n      advance();\r\n      return { type: MINUS, value: cur_char };\r\n    } else if (cur_char === \"\/\") {\r\n      advance();\r\n      return { type: DIVIDED, value: cur_char };\r\n    } else if (cur_char === \"*\") {\r\n      advance();\r\n      return { type: TIMES, value: cur_char };\r\n    }\r\n    else if (cur_char === \"(\") {\r\n      advance();\r\n      return { type: LPAREN, value: cur_char };\r\n    }\r\n    else if (cur_char === \")\") {\r\n      advance();\r\n      return { type: RPAREN, value: cur_char };\r\n    }\r\n  };\r\n\r\n  const advance = () => {\r\n    pos++;\r\n  }\r\n\r\n  const error = (msg = \"Error\") => {\r\n    let full_pos = 0;\r\n    for (let i = 0; i < pos;) {\r\n      if (program_full[full_pos] !== \" \") i++;\r\n      full_pos++;\r\n    }\r\n    throw `${msg} at col ${full_pos}`;\r\n  };\r\n\r\n  const isNumber = str => {\r\n    return !Number.isNaN(parseInt(str));\r\n  };\r\n\r\n  const getNumber = num => {\r\n    advance();\r\n    if (isNumber(program[pos])) {\r\n      return getNumber(`${num}${program[pos]}`);\r\n    } else {\r\n      return { type: NUM, value: parseInt(num) };\r\n    }\r\n  };\r\n\r\n  const eat = type => {\r\n    console.log(type, curr_token.type);\r\n    if (curr_token.type === type) curr_token = get_next_token();\r\n    else {\r\n      if (type === RPAREN) error(\"Missing closing parenthesis\");\r\n      else error(\"Wrong token type\");\r\n    }\r\n  };\r\n\r\n  \/*\r\n  Grammar\r\n    expr: term ((PLUS | MINUS) term)*\r\n    term: block ((MUL | DIV) block)*\r\n    block: factor | LPAREN expr RPAREN\r\n    factor: INTEGER\r\n   *\/\r\n\r\n  const factor = () => {\r\n    let token = curr_token;\r\n    eat(NUM);\r\n    return NumNode(token);\r\n  }\r\n\r\n  const lParen = () => {\r\n    if (curr_token.type === LPAREN) {\r\n      eat(LPAREN);\r\n      return true;\r\n    }\r\n    return false;\r\n  }\r\n  const rParen = () => {\r\n    eat(RPAREN);\r\n  }\r\n\r\n  const block = () => {\r\n    if (curr_token.type === NUM) return factor();\r\n    else if (lParen()) {\r\n      let inner_res = expr();\r\n      rParen();\r\n      return inner_res;\r\n\r\n    }\r\n    \/\/ else {\r\n    \/\/   res = factor();\r\n    \/\/ }\r\n  }\r\n\r\n  const term = () => {\r\n    let node = block();\r\n\r\n    while (curr_token.type !== EOF && (curr_token.type === TIMES || curr_token.type === DIVIDED)) {\r\n      let op = curr_token;\r\n      if (op.type === TIMES) {\r\n        eat(TIMES);\r\n      }\r\n      else if (op.type === DIVIDED) {\r\n        eat(DIVIDED);\r\n      }\r\n      node = OpNode(node, op, block());\r\n    }\r\n\r\n    return node;\r\n  }\r\n\r\n  const expr = (init) => {\r\n    if (init) curr_token = get_next_token();\r\n    let node = term();\r\n\r\n    while (curr_token.type !== EOF && (curr_token.type === PLUS || curr_token.type === MINUS)) {\r\n      let op = curr_token;\r\n      if (op.type === PLUS) {\r\n        eat(PLUS);\r\n\r\n      }\r\n      else if (op.type === MINUS) {\r\n        eat(MINUS);\r\n\r\n\r\n      }\r\n      node = OpNode(node, op, term());\r\n    }\r\n\r\n    return node;\r\n  };\r\n  return expr(true);\r\n  \/\/ try {\r\n  \/\/   return expr(true);\r\n  \/\/ } catch (e) {\r\n  \/\/   console.error(e);\r\n  \/\/   return null;\r\n  \/\/ }\r\n};\r\n\r\n\r\nlet Interpreter = (ast) => {\r\n  let visitMethods = [];\r\n  visitMethods[\'visitOpNode\'] = (node) => {\r\n    if (node.op === PLUS) return visit(node.left) + visit(node.right);\r\n    if (node.op === MINUS) return visit(node.left) - visit(node.right);\r\n    if (node.op === TIMES) return visit(node.left) * visit(node.right);\r\n    if (node.op === DIVIDED) return visit(node.left) \/ visit(node.right);\r\n  }\r\n\r\n  visitMethods[\'visitNumNode\'] = (node) => {\r\n    return node.value;\r\n  }\r\n\r\n  const visit = (node) => {\r\n    return visitMethods[`visit${node.nodeType}`](node);\r\n  }\r\n\r\n  return visit(ast);\r\n}\r\n\r\nconst fullInterpreter = (program) => {\r\n  try {\r\n    let ast = Parser(program);\r\n    \/\/ let ast = Parser(\"7 + 3 * (10 \/ (12 \/ (3 + 1) - 1))\");\r\n    \/\/ let ast = Parser(\"7 + 3 * (10 \/ (12 \/ (3 + 1) - 1)) \/ (2 + 3) - 5 - 3 + (8)\");\r\n    \/\/ let ast = Parser(\"(((8) * 2)) + 5 * (2) + 100\");\r\n    \/\/ console.log(ast);\r\n\r\n    let calculated = Interpreter(ast);\r\n    \/\/ console.log(calculated);\r\n\r\n    return { ast, output: calculated }\r\n\r\n  }\r\n  catch (e) {\r\n    console.error(e);\r\n    return { ast: \'Error\', output: \'Error\' }\r\n  }\r\n\r\n}\r\n\r\nexport default fullInterpreter;\r\n'

export default text;