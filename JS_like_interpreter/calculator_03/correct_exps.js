const EOF = "EOF",
  NUM = "NUM",
  PLUS = "PLUS",
  MINUS = "MINUS",
  DIVIDED = "DIVIDED",
  TIMES = "TIMES";

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
      error("Wrong token type");
    }
  };

  /*
  Grammar
    expr: term ((PLUS | MINUS) term)*
    term: factor ((MUL | DIV) factor)*
    factor: INTEGER
   */

  const factor = () => {
    let token = currToken;
    eat(NUM);
    return token;
  }

  const term = () => {
    let res = factor();

    while (currToken.type !== EOF && (currToken.type === TIMES || currToken.type === DIVIDED)) {
      let op = currToken;
      if (op.type === TIMES) {
        eat(TIMES);
        res.value *= factor().value;
      }
      else if (op.type === DIVIDED) {
        eat(DIVIDED);
        res.value /= factor().value;

      }
    }

    return res;
  }

  const expr = () => {
    currToken = getNextToken();
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

  try {
    return expr(program);
  } catch (e) {
    console.error(e);
    return null;
  }
};
let res = Interpreter("34 + 2 * 2 + 4 / 2");
// let res = Interpreter("34 - 14");
console.log(res.value);
