const EOF = "EOF",
  NUM = "NUM",
  PLUS = "PLUS",
  MINUS = "MINUS",
  DIVIDED = "DIVIDED",
  TIMES = "TIMES",
  LPAREN = "LPAREN",
  RPAREN = "RPAREN",
  VAR = "VAR",
  ID = "ID",
  ASSIGN = "ASSIGN",
  SEMI = "SEMI";

const BinOpNode = (left, op, right) => {
  return { left, token: op, op: op.type, right, nodeType: "BinOpNode" };
};

const UnaryOpNode = (op, expr) => {
  return { op, expr, nodeType: "UnaryOpNode" };
};

const NumNode = token => {
  return { token, value: token.value, nodeType: "NumNode" };
};

const VarAssignNode = (idToken, valueToken) => {
  return { idToken, valueToken, nodeType: "VarAssignNode" };
};

const VarReAssignNode = (idToken, valueToken) => {
  return { idToken, valueToken, nodeType: "VarReAssignNode" };
};

const varDeclareNode = idToken => {
  return { idToken, nodeType: "VarDeclareNode"};
}

const IdNode = token => {
  return { value: token.value, token, nodeType: "IdNode" };
};

const StatementListNode = statementArr => {
  return { statementArr, nodeType: "StatementListNode" };
};

const Lexer = (program, pos) => {
  const getNextToken = () => {
    if (pos > program.length - 1) return { type: EOF, value: null };

    let currChar = program[pos];

    if (/[ \n\t]/.test(currChar)) {
      advance();
      return getNextToken();
    }
    if (isNumber(currChar)) {
      return getNumber(currChar);
    } else if ((variableToken = getVariable()) !== false) return variableToken;
    // else if (isVAR()) {
    //   // this would return true even if 'variable' was given to it; need to fix whitespace handeling
    //   advance(3);
    //   return { type: VAR, value: "var" };
    // } else if ((id = isID()) !== false) {
    //   return { type: ID, value: id };
    else if (currChar === "+") {
      advance();
      return { type: PLUS, value: currChar };
    } else if (currChar === "-") {
      advance();
      return { type: MINUS, value: currChar };
    } else if (currChar === "/") {
      advance();
      return { type: DIVIDED, value: currChar };
    } else if (currChar === "*") {
      advance();
      return { type: TIMES, value: currChar };
    } else if (currChar === "(") {
      advance();
      return { type: LPAREN, value: currChar };
    } else if (currChar === ")") {
      advance();
      return { type: RPAREN, value: currChar };
    } else if (currChar === ";") {
      advance();
      return { type: SEMI, value: currChar };
    } else if (currChar === "=") {
      advance();
      return { type: ASSIGN, value: currChar };
    }
  };

  const peek = () => {
    if (pos + 1 > program.length - 1) return null;
    return program[pos + 1];
  };

  const advance = (distance = 1) => {
    if (distance === 0) console.error("Invalid advance distance");
    pos += distance;
  };

  const isNumber = char => {
    return !Number.isNaN(parseInt(char));
  };

  const getNumber = num => {
    advance();
    if (isNumber(program[pos])) {
      return getNumber(`${num}${program[pos]}`);
    } else {
      return { type: NUM, value: parseInt(num) };
    }
  };

  const RESERVED_TOKENS = {
    var: { type: VAR, value: "var" }
  };

  const getVariable = () => {
    let localPos = 0;
    let result = program[pos];
    if (!/[a-zA-Z]/.test(result)) return false;

    while (/[\w]/.test(program[++localPos + pos]))
      result += program[localPos + pos];
    advance(localPos);
    return RESERVED_TOKENS.hasOwnProperty(result)
      ? RESERVED_TOKENS[result]
      : { type: ID, value: result };
  };

  return { token: getNextToken(), pos };
};

const Parser = program => {
  let programFull = program.split("");
  // program = program.split("").filter(c => (c !== " " ? true : false));
  program = program.split("");
  let pos = 0;
  let currToken = "";

  const eat = type => {
    console.log(type, currToken.type);
    if (currToken.type === type) {
      let lexerReturn = Lexer(program, pos);
      pos = lexerReturn.pos;
      currToken = lexerReturn.token;
    } else {
      if (type === RPAREN) error("Missing closing parenthesis");
      else error(`Wrong token type. Expected ${type}`);
    }
  };

  const error = (msg = "Error") => {
    let fullPos = 0;
    for (let i = 0; i < pos; ) {
      if (programFull[fullPos] !== " ") i++;
      fullPos++;
    }
    throw `${msg} at col ${fullPos}`;
  };

  /*
  Grammar -- old
    progam: statementList
    statementList: statement+
    statement: expr; | variableAssignment; | empty
    variableAssignment: VAR ID ASSIGN expr
    expr: term ((PLUS | MINUS) term)*
    term: factor ((MUL | DIV) block)*
    factor: (PLUS | MINUS) factor | INTEGER | LPAREN expr RPAREN | variable


  Grammar -- new
    program: statementList
    statementList: statement+
    statement: (variableAssign | functionCall) SEMI | empty
    empty: 
    variableAssign: VAR variableDeclaration ASSIGN (expr | functionDeclaration)
    variableDeclaration: ID
    functionCall: ID LPAREN (expr (COMMA expr)*)* RPAREN
    functionDeclaration: LPAREN (variableDeclaration) RPAREN ARROW block
    block: LCURLY statementList RCURLY
    expr: term ((PLUS | MINUS) term)*
    term: factor ((TIMES | DIVIDED) factor)*
    factor: INTEGER | ID | LPAREN expr RPAREN | (PLUS | MINUS) factor
   */

  const factor = () => {
    let token = currToken;

    if (currToken.type === PLUS) {
      eat(PLUS);
      return UnaryOpNode(token, factor());
    }
    if (currToken.type === MINUS) {
      eat(MINUS);
      return UnaryOpNode(token, factor());
    }
    if (currToken.type === NUM) {
      eat(NUM);
      return NumNode(token);
    } else if (lParen()) {
      let innerRes = expr();
      rParen();
      return innerRes;
    } else if (currToken.type === ID) {
      return variableId();
    }
  };

  const lParen = () => {
    if (currToken.type === LPAREN) {
      eat(LPAREN);
      return true;
    }
    return false;
  };
  const rParen = () => {
    eat(RPAREN);
  };

  const term = () => {
    let node = factor();

    while (
      currToken.type !== EOF &&
      (currToken.type === TIMES || currToken.type === DIVIDED)
    ) {
      let op = currToken;
      if (op.type === TIMES) {
        eat(TIMES);
      } else if (op.type === DIVIDED) {
        eat(DIVIDED);
      }
      node = BinOpNode(node, op, factor());
    }

    return node;
  };

  const expr = () => {
    let node = term();

    while (
      currToken.type !== EOF &&
      (currToken.type === PLUS || currToken.type === MINUS)
    ) {
      let op = currToken;
      if (op.type === PLUS) {
        eat(PLUS);
      } else if (op.type === MINUS) {
        eat(MINUS);
      }
      node = BinOpNode(node, op, term());
    }

    return node;
  };

  const variableId = () => {
    let id = IdNode(currToken);
    eat(ID);
    return id;
  };

  const variableStatement = () => { /// !!! should prob fix this ugh
    if (currToken.type === VAR) {
      eat(VAR);
      const id = variableId();
      if (currToken.type === ASSIGN) return variableAssign(id);
      else return variableDeclare(id);
    }
    else if (currToken.type === ID) {
      const id = variableId();
      eat(ASSIGN);
      const value = expr();
      return VarReAssignNode(id, value);
    }  
  };

  const variableStatementFunction = () => {
    const id = variableId();
    return variableDeclare(id);
  }

  const variableAssign = id => {
    eat(ASSIGN);
    const value = expr();
    return VarAssignNode(id, value);
  }

  const variableDeclare = id => {
    return varDeclareNode(id);
  }

  const statement = () => {
    let node;
    if (currToken.type === VAR || currToken.type === ID) {
      node = variableStatement();
    } else if (currToken.type === EOF) return;
    // this will be be branch for empty if I add blocks
    else node = expr();

    eat(SEMI);
    return node;
  };

  const statementList = () => {
    let nodeArr = [statement()];
    while (currToken.type !== EOF) {
      nodeArr.push(statement());
    }
    return StatementListNode(nodeArr);
  };

  const programWhole = init => {
    if (init) {
      let lexerReturn = Lexer(program, pos);
      pos = lexerReturn.pos;
      currToken = lexerReturn.token;
    }

    let ast = statementList();

    if (currToken.type !== EOF) error("Invalid program.");
    return ast;
  };

  return programWhole(true);
};

let Interpreter = ast => {
  let env = {};

  let visitMethods = [];
  visitMethods["visitBinOpNode"] = node => {
    if (node.op === PLUS) return visit(node.left) + visit(node.right);
    if (node.op === MINUS) return visit(node.left) - visit(node.right);
    if (node.op === TIMES) return visit(node.left) * visit(node.right);
    if (node.op === DIVIDED) return visit(node.left) / visit(node.right);
  };

  visitMethods["visitNumNode"] = node => {
    return node.value;
  };

  visitMethods["visitUnaryOpNode"] = node => {
    if (node.op.type === MINUS) return -visit(node.expr);
    else return visit(node.expr);
  };

  visitMethods["visitStatementListNode"] = node => {
    node.statementArr.forEach(list => visit(list));
  };

  visitMethods["visitIdNode"] = node => {
    let value = env[node.value];
    console.log(value, "<-- value")
    let error = value === null ? 'variable declared, but unassigned' : 'undefined'
    return value || error;
  };

  visitMethods["visitVarAssignNode"] = node => {
    env[node.idToken.value] = visit(node.valueToken);
    console.log(env);
  };

  visitMethods["visitVarReAssignNode"] = node => {
    env[node.idToken.value] !== undefined
      ? env[node.idToken.value] = visit(node.valueToken)
      : 'Error - variable not declared';
    console.log(env);
  };

  visitMethods["visitVarDeclareNode"] = node => {
    env[node.idToken.value] = null;
    console.log(env);
  };

  const visit = node => {
    console.log(node.nodeType);

    return visitMethods[`visit${node.nodeType}`](node);
  };

  return visit(ast);
};

try {
  // let res = Parser("7 + 3 * (10 / (12 / (3 + 1) - 1))");
  // let res = Parser("7 + -3");
  // let res = Parser("7 + 3 * (10 / (12 / (3 + 1) - 1)) / (2 + 3) - 5 - 3 + (8)");
  // let res = Parser("(((8) * 2)) + 5 * (2) + 100");

  let res = Parser("var bum = variable + 6; var rum = 56;");
  // let res = Parser('var num = 10;');
  // console.log(res);
  res["statementArr"].forEach(statement => console.log(statement));

  let calculated = Interpreter(res);
  console.log(calculated);
} catch (e) {
  console.error(e);
}
