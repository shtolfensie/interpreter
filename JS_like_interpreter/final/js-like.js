const EOF = "EOF",
  NUM = "NUM",
  PLUS = "PLUS",
  MINUS = "MINUS",
  DIVIDED = "DIVIDED",
  TIMES = "TIMES",
  LPAREN = "LPAREN",
  RPAREN = "RPAREN",
  LCURLY = "LCURLY",
  RCURLY = "RCURLY",
  VAR = "VAR",
  FUN = "FUN",
  IF = "IF",
  ELSE = "ELSE",
  FOR = "FOR",
  WHILE = "WHILE",
  ID = "ID",
  AND = "AND",
  OR = "OR",
  CMPOP = "CMPOP",
  ASSIGN = "ASSIGN",
  SEMI = "SEMI",
  COMMA = "COMMA",
  ARROW = "ARROW";

const BinOpNode = (left, op, right) => {
  return { left, token: op, op: op.type, right, nodeType: "BinOpNode" };
};

const UnaryOpNode = (op, expr) => {
  return { op, expr, nodeType: "UnaryOpNode" };
};

const LogicOpNode = (left, op, right) => {
  return {left, token: op, op: op ? op.type : false, right, nodeType: "LogicOpNode"}
};
const CompOpNode = (left, op, right) => {
  return {left, token: op, op: op ? op.value : false, right, nodeType: "CompOpNode"}
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

const VarDeclareNode = (idToken, assignValueNode) => {
  return { idToken, assignValueNode, nodeType: "VarDeclareNode"};
};

const FuncDeclareNode = (argDeclarationArr, body) => {
  return { argDeclarationArr, body, nodeType: "FuncDeclareNode"};
};

const FuncCallNode = (idNode, argValuesArr) => {
  return { idNode, argValuesArr, nodeType: "FuncCallNode"};
};

const ScopeNode = (type, nextNode) => {
  return { type, nextNode, nodeType: "ScopeNode"}
};

const IfNode = (conditionListNode, body, elseIfNode, elseStatement) => {
  return { conditionListNode, body, elseIfNode, elseStatement, nodeType: "IfNode"};
};
const ForNode = (statement1, conditionListNode, statement2, body) => {
  return {statement1, conditionListNode, statement2, body, nodeType: "ForNode"};
};
const WhileNode = (conditionListNode, body) => {
  return {conditionListNode, body, nodeType: "WhileNode"};
};

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
    }
    else if ((variableToken = getVariable()) !== false) return variableToken;
    // else if (isVAR()) {
    //   // this would return true even if 'variable' was given to it; need to fix whitespace handeling
    //   advance(3);
    //   return { type: VAR, value: "var" };
    // } else if ((id = isID()) !== false) {
    //   return { type: ID, value: id };
    else if (currChar === "+") {
      advance();
      return { type: PLUS, value: currChar };
    }
    else if (currChar === "-") {
      advance();
      return { type: MINUS, value: currChar };
    }
    else if (currChar === "/") {
      advance();
      return { type: DIVIDED, value: currChar };
    }
    else if (currChar === "*") {
      advance();
      return { type: TIMES, value: currChar };
    }
    else if (currChar === "(") {
      advance();
      return { type: LPAREN, value: currChar };
    }
    else if (currChar === ")") {
      advance();
      return { type: RPAREN, value: currChar };
    }
    else if (currChar === "{") {
      advance();
      return { type: LCURLY, value: currChar };
    }
    else if (currChar === "}") {
      advance();
      return { type: RCURLY, value: currChar };
    }
    else if (currChar === ";") {
      advance();
      return { type: SEMI, value: currChar };
    }
    else if (currChar === ">") {
      advance(2);
      return { type: CMPOP, value: ">"};
    }
    else if (currChar === "<") {
      advance(2);
      return { type: CMPOP, value: "<"};
    }
    else if (currChar === "=" && peek() === ">") {
      advance(2);
      return { type: ARROW, value: "=>"};
    } 
    else if (currChar === "=" && peek() === "=") {
      advance(2);
      return { type: CMPOP, value: "=="};
    }
    else if (currChar === "!" && peek() === "=") {
      advance(2);
      return { type: CMPOP, value: "!="};
    }
    else if (currChar === ">" && peek() === "=") {
      advance(2);
      return { type: CMPOP, value: ">="};
    } 
    else if (currChar === "<" && peek() === "=") {
      advance(2);
      return { type: CMPOP, value: "<="};
    } 
    else if (currChar === "=") {
      advance();
      return { type: ASSIGN, value: currChar };
    }
    else if (currChar === ",") {
      advance();
      return { type: COMMA, value: currChar};
    }
    else if (currChar === "&" && peek() === "&") {
      advance(2);
      return { type: AND, value: "&&" };
    }
    else if (currChar === "|" && peek() === "|") {
      advance(2);
      return { type: OR, value: "||" };
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
    var: { type: VAR, value: "var" },
    fun: { type: FUN, value: "fun" },
    if: { type: IF, value: "if" },
    else: { type: ELSE, value: "else" },
    for: { type: FOR, value: "for" },
    while: { type: WHILE, value: "while" }
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
    }
    else {
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
    statement: (variableAssign
                | variableDeclaration
                | functionCall
                | block
                | ifStatement
                | forStatement
                | whileStatement) SEMI | empty
    empty: 
    variableAssign: variable ASSIGN (expr | functionDeclaration)
    variableDeclaration: VAR (variable | variableAssign)
    argumentDeclaration: variable
    functionDeclaration: FUN LPAREN (argumentDeclaration (COMMA argumentDeclaration)*)* RPAREN ARROW block
    functionCall: variable LPAREN (expr (COMMA expr)*)* RPAREN
    ifStatement: IF LPAREN conditionList RPAREN block ((ELSE ifStatement) | (ELSE block))?
    whileStatement: WHILE LPAREN conditionList RPAREN block
    forStatement: FOR LPAREN forStat1? SEMI conditionList? SEMI forStat3? RPAREN block
    forStat1: variableDeclaration | variableAssign
    forStat3: variableAssign | functionCall
    conditionList: condition ((AND | OR) condition)*
    condition: LPAREN conditionList RPAREN | expr (compareOperator expr)?
    compareOperator: EQUAL | ((SMALLER | LARGER) EQUAL?) | NOTEQUAL
    block: LCURLY statementList RCURLY
    expr: term ((PLUS | MINUS) term)*
    term: factor ((TIMES | DIVIDED) factor)*
    factor: INTEGER | variable | LPAREN expr RPAREN | (PLUS | MINUS) factor
    variable: ID
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

  // const variableStatement = () => { /// !!! should prob fix this ugh
  //   if (currToken.type === VAR) {
  //     eat(VAR);
  //     const id = variableId();
  //     if (currToken.type === ASSIGN) return variableAssign(id);
  //     else return variableDeclare(id);
  //   }
  //   else if (currToken.type === ID) {
  //     const id = variableId();
  //     eat(ASSIGN);
  //     const value = expr();
  //     return VarReAssignNode(id, value);
  //   }  
  // };

  const argumentDeclaration = () => {
    const id = variableId();
    return id;
  }

  const variableAssign = id => {
    eat(ASSIGN);
    let value;
    if (currToken.type === FUN) {
      value = functionDeclaration();
    }
    else value = expr();
    return VarAssignNode(id, value);
  }

  const variableDeclare = () => {
    eat(VAR);
    const id = variableId();
    let assignValueNode = undefined;
    if (currToken.type !== SEMI) assignValueNode = variableAssign(id);
    return VarDeclareNode(id, assignValueNode);
  }

  const functionDeclaration = () => {
    eat(FUN);
    eat(LPAREN);
    let argDeclarationArr = [];
    while (currToken.type !== RPAREN && currToken.type !== EOF) {
      argDeclarationArr.push(argumentDeclaration());
      if (currToken.type !== RPAREN) eat(COMMA);
    }
    eat(RPAREN);
    eat(ARROW);
    const body = block();
    return FuncDeclareNode(argDeclarationArr, body);
  }
  const block = () => {
    eat(LCURLY);
    const body = statementList();
    eat(RCURLY);
    return body;
  }
  const functionCall = (id) => {
    eat(LPAREN);
    let argValuesArr = [];
    while (currToken.type !== RPAREN) {
      argValuesArr.push(expr());
      if (currToken.type !== RPAREN) eat(COMMA);
    }
    eat(RPAREN);
    return FuncCallNode(id, argValuesArr);
  }

  const ifStatement = () => {
    eat(IF);
    eat(LPAREN);
    let conditionListNode = conditionList();
    eat(RPAREN);
    let body = block();
    let elseIfNode = false;
    let elseStat = false;
    if (currToken.type !== SEMI && currToken.type !== EOF) { //!! maybe just if?
      eat(ELSE);
      if (currToken.type === IF) elseIfNode = ifStatement();
      else elseStat = block();
    }
    return ScopeNode("if", IfNode(conditionListNode, body, elseIfNode, elseStat));
  }

  const conditionList = () => {
    let node = condition();
    let op = null;
    while (currToken.type === AND || currToken.type === OR) {
      op = currToken;
      if (currToken.type === AND) eat(AND);
      else eat(OR);
      node = LogicOpNode(node, op, condition());
    }
    return node;
  }
  const condition = () => {
    if (currToken.type === LPAREN) {
      eat(LPAREN);
      let list = conditionList();
      eat(RPAREN);
      return list;
    }
    let lSide = expr();
    let op = null;
    let rSide = null;
    if (currToken.type === CMPOP) {
      op = currToken;
      eat(CMPOP);
      rSide = expr();
    }
    return CompOpNode(lSide, op, rSide);
  }

  const statement = () => {
    let node;
    // if (currToken.type === VAR || currToken.type === ID) {
    //   node = variableStatement();
    // } else if (currToken.type === EOF) return;
    // // this will be be branch for empty if I add blocks
    if (currToken.type === ID) {
      const id = variableId();
      if (currToken.type === LPAREN) node = functionCall(id);
      else node = variableAssign(id);
    }
    else if (currToken.type === VAR) node = variableDeclare();
    else if (currToken.type === IF) node = ifStatement();
    else if (currToken.type === RCURLY || currToken.type === EOF) return;
    else node = expr();

    eat(SEMI);
    return node;
  };

  const statementList = () => {
    let nodeArr = [statement()];
    while (currToken.type !== EOF && currToken.type !== RCURLY) {
      nodeArr.push(statement());
    }
    return StatementListNode(nodeArr.filter(n => n !== undefined));
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
  // let env = {};
  let envStack = [{}];
  const getVal = (v) => {
    for (let i = envStack.length-1; i > -1; i--) {
      let res = envStack[i][v];
      if (res !== undefined) return res;
    }
    // error here
  }
  const getEnvIndex = (v) => {
    for (let i = envStack.length-1; i > -1; i--) {
      let res = envStack[i][v];
      if (res !== undefined) return i;
    }
    // error here
  }
  const makeEnv = (argDec = [], argVal) => {
    let newEnv = {};
    if (argDec.length !== 0 && (argDec.length === argVal.length)) {
      for (let i = 0; i < argDec.length; i++) {
        newEnv[argDec[i].value] = visit(argVal[i]);
      }
    }
    return newEnv;
  }
  const fillEnv = (argDec, argVal) => {
    if (argDec.length !== 0 && (argDec.length === argVal.length)) {
      for (let i = 0; i < argDec.length; i++) {
        envStack[envStack.length-1][argDec[i].value] = visit(argVal[i]);
      }
    }
  }

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
    // let value = env[node.value];
    let value = getVal(node.value);
    // console.log(value, "<-- value")
    // let error = value === null ? 'variable declared, but unassigned' : 'undefined'
    // return value || error;
    return value;
  };

  visitMethods["visitVarAssignNode"] = node => {
    envStack[getEnvIndex(node.idToken.value)][node.idToken.value] !== undefined
      ? envStack[getEnvIndex(node.idToken.value)][node.idToken.value] = visit(node.valueToken)
      : 'Error - variable not declared';
    // console.log(envStack);
  };

  visitMethods["visitVarDeclareNode"] = node => {
    let value = null;
    envStack[envStack.length-1][node.idToken.value] = value;
    if (node.assignValueNode !== undefined) visit(node.assignValueNode);
    // console.log(envStack);
  };

  visitMethods["visitFuncDeclareNode"] = node => {
    return { type: 'function', declarations: node.argDeclarationArr, body: node.body };
  }

  visitMethods["visitFuncCallNode"] = node => {
    const declaredFunc = visit(node.idNode);
    if (typeof declaredFunc === "object" && declaredFunc.type === "function") {
      envStack.push(makeEnv(declaredFunc.declarations, node.argValuesArr));
      // console.log("body: ", declaredFunc.body)
      visit(declaredFunc.body);
      console.log(envStack)
      envStack.pop();
    }
  }

  visitMethods["visitScopeNode"] = node => {
    envStack.push(makeEnv());
    visit(node.nextNode);
    envStack.pop();
  }

  visitMethods["visitIfNode"] = node => {
    if (visit(node.conditionListNode)) visit(node.body);
    else if (node.elseStatement) visit(node.elseStatement);
    else if (node.elseIfNode) visit(node.elseIfNode);
  }

  visitMethods["visitLogicOpNode"] = node => {
    let left = visit(node.left);
    if (node.op) {
      let right = visit(node.right);
      if (node.op === AND) return left && right;
      else if (node.op === OR) return left || right;
    }
  }

  visitMethods["visitCompOpNode"] = node => {
    let left = visit(node.left);
    if (node.op) {
      let right = visit(node.right);
      switch (node.op) {
        case "==":
          return left === right;
        case "!=":
          return left !== right;
        case ">":
          return left > right;
        case "<":
          return left < right;
        case ">=":
          return left >= right;
        case "<=":
          return left <= right;
      }
    }
    else return !!left;
  }

  const visit = node => {
    // console.log(node.nodeType);

    return visitMethods[`visit${node.nodeType}`](node);
  };

  let r = visit(ast);
  console.log(envStack)
  return r;
};

try {
  // let res = Parser("7 + 3 * (10 / (12 / (3 + 1) - 1))");
  // let res = Parser("7 + -3");
  // let res = Parser("7 + 3 * (10 / (12 / (3 + 1) - 1)) / (2 + 3) - 5 - 3 + (8)");
  // let res = Parser("(((8) * 2)) + 5 * (2) + 100");

  // let res = Parser("var t; var bum = 6; var rum = bum + 56;");
  // let res = Parser("var bum = 6; var rum = bum + 56; var f = fun (bum) => { var b = bum; var cc = rum;}; f(100);");
  // let res = Parser(`var bum = 6; 
  //                   var rum = bum + 56;
  //                   var f = fun(bum) => {
  //                     var b = bum;
  //                     var cc = rum;
  //                     rum = 8;
  //                   }; 
  //                   var di = fun () => {
  //                     rum = 999;
  //                     f(99+1);
  //                   };
  //                   di();
  //                   var test = rum;`);
  let res = Parser(`
    var t = 0;
    if (t && 1) {
      t = 4;
    };
  `);
  // let res = Parser(` factorial
  //   var res = 0;
  //   var fac = fun (n) => {
  //     if (n > 1) {
  //       fac(n-1);
  //       res = res * n;
  //     } else {
  //       res = 1;
  //     };
  //   };
  //   fac(5);
  // `);
  // let res = Parser(` // fib numbers
  //   var res = 0;
  //   var fib = fun (n) => {
  //     if (n == 1){
  //       res = 1;
  //     } else if (n == 2) {
  //       res = 1;
  //     } else {
  //       fib(n-1);
  //       var temp = res;
  //       fib(n-2);
  //       res = temp + res;
  //     };
  //   };
  //   fib(19);
  // `);
  // let res = Parser(` // exponents
  //   var expM = fun (b, e) => {
  //     var res = 0;
  //     var exp = fun (b, e) => {
  //       if (e == 1) {
  //         res = b;
  //       } else if (e == -1) {
  //         res = 1 / b;
  //       } else if (e < 0) {
  //         exp(b, e+1);
  //         res = res / b;
  //       } else {
  //         exp(b, e-1);
  //         res = b * res;
  //       };
  //     };
  //     exp(b, e);
  //   };
  //   expM(4,-3);
  // `);
  // let res = Parser('var num = 10;');
  // console.log(res);
  // res["statementArr"].forEach(statement => console.log(statement));

  let calculated = Interpreter(res);
  console.log(calculated);
} catch (e) {
  console.error(e);
}
