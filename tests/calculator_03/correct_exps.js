const EOF = "EOF",
  NUM = "NUM",
  PLUS = "PLUS",
  MINUS = "MINUS",
  DIVIDED = "DIVIDED",
  TIMES = "TIMES";

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
    let token = curr_token;
    eat(NUM);
    return token;
  }

  const term = () => {
    let res = factor();

    while (curr_token.type !== EOF && (curr_token.type === TIMES || curr_token.type === DIVIDED)) {
      let op = curr_token;
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
    curr_token = get_next_token();
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

  try {
    return expr(program);
  } catch (e) {
    console.error(e);
    return null;
  }
};
let res = Interpreter("34 + 2 * 2");
// let res = Interpreter("34 - 14");
console.log(res.value);
