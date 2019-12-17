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

  const term = () => {
    let token = curr_token;
    eat(NUM);
    return token;
  }

  const evaluation = () => {
    curr_token = get_next_token();
    let res = term();

    while (curr_token.type !== EOF) {
      let op = curr_token;
      if (op.type === PLUS) {
        eat(PLUS);
        res.value += term().value;
      }
      else if (op.type === MINUS) {
        eat(MINUS);
        res.value -= term().value;

      }
      else if (op.type === DIVIDED) {
        eat(DIVIDED);
        res.value /= term().value;
      }
      else if (op.type === TIMES) {
        eat(TIMES);
        res.value *= term().value;
      }
    }

    return res.value;
  };

  return evaluation(program);

};

const interpreter_full = program => {

  try {
    let res = Interpreter(program);
    return { ast: 'No AST generated', output: res }

  } catch (e) {
    console.error(e);
    return { ast: 'Error', output: 'Error' };
  }

}

export default interpreter_full;