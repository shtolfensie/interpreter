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

const VarAssignNode = (id, value) => {
  return { id, value, nodeType: "VarAssignNode" }
}

const IdNode = (token) => {
  return { value: token.value, token, nodeType: "IdNode" }
}

const StatementListNode = (statementArr) => {
  return { statementArr, nodeType: "StatementListNode" }
}

const Lexer = (program, pos) => {
  const getNextToken = () => {
    if (pos > program.length - 1) return { type: EOF, value: null };

    let currChar = program[pos];

    if (isNumber(currChar)) {
      return getNumber(currChar);
    }
    else if (isVAR()) { // this would return true even if 'variable' was given to it; need to fix whitespace handeling
      advance(3);
      return { type: VAR, value: 'var' }
    }
    else if ((id = isID()) !== false) {
      return { type: ID, value: id }
    }
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
    }
    else if (currChar === ';') {
      advance();
      return { type: SEMI, value: currChar };
    }
    else if (currChar === '=') {
      advance();
      return { type: ASSIGN, value: currChar };
    }
  };

  const peek = () => {
    if (pos + 1 > program.length - 1) return null;
    return program[pos + 1];
  }

  const advance = (distance = 1) => {
    if (distance === 0) console.error('Invalid advance distance');
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

  const isVAR = () => {
    const template = 'var'.split('');
    let localPos = 0;
    for (; localPos < template.length; localPos++) {
      if (template[localPos] !== program[pos + localPos]) return false;
    }

    // template.forEach(c => {
    //   if (c !== program[pos + localPos]) return false;
    //   else {
    //     localPos++;
    //   }
    // });
    return true;
  }

  const isID = () => {
    let localPos = 0;
    let id = '';
    if (/[a-zA-Z]/.test(program[pos])) {
      id += program[pos];
      while (/[\w]/.test(program[++localPos + pos])) {
        id += program[localPos + pos];
      }
      advance(localPos);
      console.log(id);

      return id;
    }
    else return false;
  }

  return { token: getNextToken(), pos };

};

const Parser = program => {
  let programFull = program.split("");
  program = program.split("").filter(c => (c !== " " ? true : false));
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
    for (let i = 0; i < pos;) {
      if (programFull[fullPos] !== " ") i++;
      fullPos++;
    }
    throw `${msg} at col ${fullPos}`;
  };

  /*
  Grammar
    progam: statementList
    statementList: statement+
    statement: expr; | variableAssignment; | empty
    variableAssignment: VAR ID ASSIGN expr
    expr: term ((PLUS | MINUS) term)*
    term: factor ((MUL | DIV) block)*
    factor: (PLUS | MINUS) factor | INTEGER | LPAREN expr RPAREN | variable

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
    }
    else if (currToken.type === ID) {
      return variable();
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

  const variable = () => {
    let id = IdNode(currToken);
    eat(ID);
    return id;
  }

  const assignStatement = () => {
    eat(VAR);
    let id = variable();

    eat(ASSIGN);
    let value = expr();
    return VarAssignNode(id, value);
  }


  const statement = () => {
    let node;
    if (currToken.type === VAR) {
      node = assignStatement();
    }
    else if (currToken.type === EOF) return; // this will be be branch for empty if I add blocks
    else node = expr();

    eat(SEMI);
    return node;
  }

  const statementList = () => {
    let nodeArr = [statement()];
    while (currToken.type !== EOF) {
      nodeArr.push(statement());
    }
    return StatementListNode(nodeArr);
  }

  const programWhole = init => {
    if (init) {
      let lexerReturn = Lexer(program, pos);
      pos = lexerReturn.pos;
      currToken = lexerReturn.token;
    }

    let ast = statementList();

    if (currToken.type !== EOF) error('Invalid program.');
    return ast;
  }

  return programWhole(true);
};

let Interpreter = ast => {
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

  let res = Parser('var num = 10; 2 + 4; var bum = num + 6;');
  // let res = Parser('var num = 10;');
  console.log(res.statementArr[2]);

  // let calculated = Interpreter(res);
  // console.log(calculated);
} catch (e) {
  console.error(e);
}
