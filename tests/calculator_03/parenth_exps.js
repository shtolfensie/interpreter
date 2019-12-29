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
  let currToken = "";

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
    }
    else if (currChar === "(") {
      advance();
      return { type: LPAREN, value: currChar };
    }
    else if (currChar === ")") {
      advance();
      return { type: RPAREN, value: currChar };
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
    if (currToken.type === type) currToken = getNextToken();
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
    let token = currToken;
    eat(NUM);
    return token;
  }

  const lParen = () => {
    if (currToken.type === LPAREN) {
      eat(LPAREN);
      return true;
    }
    return false;
  }
  const rParen = () => {
    eat(RPAREN);
  }

  const block = () => {
    if (currToken.type === NUM) return factor();
    else if (lParen()) {
      let innerRes = expr();
      rParen();
      return innerRes;

    }
    // else {
    //   res = factor();
    // }

  }

  const term = () => {
    let res = block();

    while (currToken.type !== EOF && (currToken.type === TIMES || currToken.type === DIVIDED)) {
      let op = currToken;
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
    if (init) currToken = getNextToken();
    let res = term();

    while (currToken.type !== EOF && (currToken.type === PLUS || currToken.type === MINUS)) {
      let op = currToken;
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
