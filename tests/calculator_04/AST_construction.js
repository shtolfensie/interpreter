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
  const get_next_token = () => {
    if (pos > program.length - 1) return { type: EOF, value: null };

    let cur_char = program[pos];

    if (isNumber(cur_char)) {
      return getNumber(cur_char);

      // return { type: NUM, value: parseInt(cur_char) };
    } else if (cur_char === "+") {
      advance();
      return { type: PLUS, value: cur_char };
    } else if (cur_char === "-") {
      advance();
      return { type: MINUS, value: cur_char };
    } else if (cur_char === "/") {
      advance();
      return { type: DIVIDED, value: cur_char };
    } else if (cur_char === "*") {
      advance();
      return { type: TIMES, value: cur_char };
    } else if (cur_char === "(") {
      advance();
      return { type: LPAREN, value: cur_char };
    } else if (cur_char === ")") {
      advance();
      return { type: RPAREN, value: cur_char };
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

  return { token: get_next_token(), pos };

  // try {
  //   return expr(true);
  // } catch (e) {
  //   console.error(e);
  //   return null;
  // }
};

const Parser = program => {
  let program_full = program.split("");
  program = program.split("").filter(c => (c !== " " ? true : false));
  let pos = 0;
  let curr_token = "";

  const eat = type => {
    console.log(type, curr_token.type);
    if (curr_token.type === type) {
      let lexer_return = Lexer(program, pos);
      pos = lexer_return.pos;
      curr_token = lexer_return.token;
    } else {
      if (type === RPAREN) error("Missing closing parenthesis");
      else error("Wrong token type");
    }
  };

  const error = (msg = "Error") => {
    let full_pos = 0;
    for (let i = 0; i < pos; ) {
      if (program_full[full_pos] !== " ") i++;
      full_pos++;
    }
    throw `${msg} at col ${full_pos}`;
  };

  /*
  Grammar
    expr: term ((PLUS | MINUS) term)*
    term: factor ((MUL | DIV) block)*
    factor: (PLUS | MINUS) factor | INTEGER | LPAREN expr RPAREN
   */

  const factor = () => {
    let token = curr_token;

    if (curr_token.type === PLUS) {
      eat(PLUS);
      return UnaryOpNode(token, factor());
    }
    if (curr_token.type === MINUS) {
      eat(MINUS);
      return UnaryOpNode(token, factor());
    }
    if (curr_token.type === NUM) {
      eat(NUM);
      return NumNode(token);
    } else if (lParen()) {
      let inner_res = expr();
      rParen();
      return inner_res;
    }
  };

  const lParen = () => {
    if (curr_token.type === LPAREN) {
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
      curr_token.type !== EOF &&
      (curr_token.type === TIMES || curr_token.type === DIVIDED)
    ) {
      let op = curr_token;
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
      let lexer_return = Lexer(program, pos);
      pos = lexer_return.pos;
      curr_token = lexer_return.token;
    }
    let node = term();

    while (
      curr_token.type !== EOF &&
      (curr_token.type === PLUS || curr_token.type === MINUS)
    ) {
      let op = curr_token;
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
