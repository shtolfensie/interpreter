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
      pos++;
      return { type: PLUS, value: currChar };
    } else if (currChar === "-") {
      pos++;
      return { type: MINUS, value: currChar };
    } else if (currChar === "/") {
      pos++;
      return { type: DIVIDED, value: currChar };
    } else if (currChar === "*") {
      pos++;
      return { type: TIMES, value: currChar };
    }
  };

  const error = (msg = "Error") => {
    throw msg;
  };

  const isNumber = str => {
    return !Number.isNaN(parseInt(str));
  };

  const getNumber = num => {
    pos++;
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

  const eval = () => {
    currToken = getNextToken();
    let res = currToken;
    eat(NUM);

    while (currToken.type !== EOF) {
      let op = currToken;
      if (op.type === PLUS) eat(PLUS);
      else if (op.type === MINUS) eat(MINUS);
      else if (op.type === DIVIDED) eat(DIVIDED);
      else if (op.type === TIMES) eat(TIMES);

      let right = currToken;
      eat(NUM);

      if (op.type === PLUS) res.value += right.value;
      if (op.type === MINUS) res.value -= right.value;
      if (op.type === DIVIDED) res.value /= right.value;
      if (op.type === TIMES) res.value *= right.value;
    }
    return res.value;
  };

  try {
    return eval(program);
  } catch (e) {
    console.error(e);
    return null;
  }
};
let res = Interpreter("34 - 14 + 3 - 20 * 2 * 3");
console.log(res);
