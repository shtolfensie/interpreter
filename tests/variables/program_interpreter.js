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
  const get_next_token = () => {
    if (pos > program.length - 1) return { type: EOF, value: null };

    let cur_char = program[pos];

    if (isNumber(cur_char)) {
      return getNumber(cur_char);
    }
    else if (isVAR()) { // this would return true even if 'variable' was given to it; need to fix whitespace handeling
      advance(3);
      return { type: VAR, value: 'var' }
    }
    else if ((id = isID()) !== false) {
      return { type: ID, value: id }
    }
    else if (cur_char === "+") {
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
    else if (cur_char === ';') {
      advance();
      return { type: SEMI, value: cur_char };
    }
    else if (cur_char === '=') {
      advance();
      return { type: ASSIGN, value: cur_char };
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

  return { token: get_next_token(), pos };

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
      else error(`Wrong token type. Expected ${type}`);
    }
  };

  const error = (msg = "Error") => {
    let full_pos = 0;
    for (let i = 0; i < pos;) {
      if (program_full[full_pos] !== " ") i++;
      full_pos++;
    }
    throw `${msg} at col ${full_pos}`;
  };

  /*
  Grammar
    progam: statement_list
    statement_list: statement+
    statement: expr; | variable_assignment; | empty
    variable_assignment: VAR ID ASSIGN expr
    expr: term ((PLUS | MINUS) term)*
    term: factor ((MUL | DIV) block)*
    factor: (PLUS | MINUS) factor | INTEGER | LPAREN expr RPAREN | variable

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
    else if (curr_token.type === ID) {
      return variable();
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

  const expr = () => {
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

  const variable = () => {
    let id = IdNode(curr_token);
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
    if (curr_token.type === VAR) {
      node = assignStatement();
    }
    else if (curr_token.type === EOF) return; // this will be be branch for empty if I add blocks
    else node = expr();

    eat(SEMI);
    return node;
  }

  const statement_list = () => {
    let nodeArr = [statement()];
    while (curr_token.type !== EOF) {
      nodeArr.push(statement());
    }
    return StatementListNode(nodeArr);
  }

  const programWhole = init => {
    if (init) {
      let lexer_return = Lexer(program, pos);
      pos = lexer_return.pos;
      curr_token = lexer_return.token;
    }

    let ast = statement_list();

    if (curr_token.type !== EOF) error('Invalid program.');
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
