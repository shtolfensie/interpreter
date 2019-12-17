const EOF = "EOF",
  NUM = "NUM",
  PLUS = "PLUS",
  MINUS = "MINUS",
  DIVIDED = "DIVIDED",
  TIMES = "TIMES",
  LPAREN = "LPAREN",
  RPAREN = "RPAREN";

const Interpreter = program => {
  program = program.split("").filter(c => (c !== " " ? true : false));
  let pos = 0;
  let curr_token = "";

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
    }
    else if (cur_char === "(") {
      advance();
      return { type: LPAREN, value: cur_char };
    }
    else if (cur_char === ")") {
      advance();
      return { type: RPAREN, value: cur_char };
    }
  };

  const advance = () => {
    pos++;
  }

  const error = (msg = "Error") => {
    throw msg;
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

  const eat = type => {
    if (curr_token.type === type) curr_token = get_next_token();
    else {
      if (type === RPAREN) error("Missing closing parenthesis");
      else error("Wrong token type");
    }
  };

  /*
  Grammar
    expr: term ((PLUS | MINUS) term)*
    term: block ((MUL | DIV) block)*
    block: factor | LPAREN expr RPAREN
    factor: INTEGER
   */

  const factor = () => {
    let token = curr_token;
    eat(NUM);
    return token;
  }

  const lParen = () => {
    if (curr_token.type === LPAREN) {
      eat(LPAREN);
      return true;
    }
    return false;
  }
  const rParen = () => {
    eat(RPAREN);
  }

  const block = () => {
    if (curr_token.type === NUM) return factor();
    else if (lParen()) {
      let inner_res = expr();
      rParen();
      return inner_res;

    }
    // else {
    //   res = factor();
    // }

  }

  const term = () => {
    let res = block();

    while (curr_token.type !== EOF && (curr_token.type === TIMES || curr_token.type === DIVIDED)) {
      let op = curr_token;
      if (op.type === TIMES) {
        eat(TIMES);
        res.value *= block().value;
      }
      else if (op.type === DIVIDED) {
        eat(DIVIDED);
        res.value /= block().value;

      }
    }

    return res;
  }

  const expr = (init) => {
    if (init) curr_token = get_next_token();
    let res = term();

    while (curr_token.type !== EOF && (curr_token.type === PLUS || curr_token.type === MINUS)) {
      let op = curr_token;
      if (op.type === PLUS) {
        eat(PLUS);

        res.value += term().value;

      }
      else if (op.type === MINUS) {
        eat(MINUS);
        res.value -= term().value;

      }
    }

    return res;
  };
  return expr(true);
  // try {
  //   return expr(true);
  // } catch (e) {
  //   console.error(e);
  //   return null;
  // }
};
try {
  let res = Interpreter("7 + 3 * (10 / (12 / (3 + 1) - 1))");
  // let res = Interpreter("3 + 7 * (2 + 1)");
  // let res = Interpreter("34 + 2 * 2");
  // let res = Interpreter("3 + 7 * 2 + 1");
  // let res = Interpreter("(((8) * 2)) + 5 * (2) + 100");
  console.log(res.value);
}
catch (e) {
  console.error(e);
}
