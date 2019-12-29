const EOF = "EOF",
  NUM = "NUM",
  PLUS = "PLUS",
  MINUS = "MINUS",
  DIVIDED = "DIVIDED",
  TIMES = "TIMES",
  LPAREN = "LPAREN",
  RPAREN = "RPAREN";

const BinOpNode = (left, op, right) => {
  return { left, token: op, op: op.type, right, nodeType: "BinOpNode" };
};

const UnaryOpNode = (op, expr) => {
  return { op, expr, nodeType: "UnaryOpNode" };
};

const NumNode = token => {
  return { token, value: token.value, nodeType: "NumNode" };
};

const Lexer = (program, pos) => {
  const getNextToken = () => {
    if (pos > program.length - 1) return { type: EOF, value: null };

    let currChar = program[pos];

    if (isNumber(currChar)) {
      return getNumber(currChar);

      // return { type: NUM, value: parseInt(currChar) };
    } else if (currChar === "+") {
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
  };

  const advance = () => {
    pos++;
  };

  const isNumber = str => {
    return !Number.isNaN(parseInt(str));
  };

  const getNumber = num => {
    advance();
    if (isNumber(program[pos])) {
      return getNumber(`${num}${program[pos]}`);
    } else {
      return { type: NUM, value: parseInt(num) };
    }
  };

  return { token: getNextToken(), pos };

  // try {
  //   return expr(true);
  // } catch (e) {
  //   console.error(e);
  //   return null;
  // }
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
      else error("Wrong token type");
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
    expr: term ((PLUS | MINUS) term)*
    term: factor ((MUL | DIV) block)*
    factor: (PLUS | MINUS) factor | INTEGER | LPAREN expr RPAREN
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

  const expr = init => {
    if (init) {
      let lexerTeturn = Lexer(program, pos);
      pos = lexerTeturn.pos;
      currToken = lexerTeturn.token;
    }
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
  return expr(true);
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
  let res = Parser("7 + 3 * (10 / (12 / (3 + 1) - 1)) / (2 + 3) - 5 - 3 + (8)");
  // let res = Parser("(((8) * 2)) + 5 * (2) + 100");
  console.log(res);

  let calculated = Interpreter(res);
  console.log(calculated);
} catch (e) {
  console.error(e);
}
