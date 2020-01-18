const readline = require("readline");

const tokenize = program => {
  // adds whitespace around brackets, strips all ws except space, splits input string based on spaces

  for (let i = 0; i < program.length; i++) {
    if (program[i] === ";") {
      // comments start with at least one ';'
      let j = i; // remember the position of the first ';'
      while (program[j] !== "\n" && j < program.length) j++; // until we find a new line ot the program ends
      program = program.slice(0, i) + program.slice(j); // slice out the comment
    }
  }

  return program
    .replace(/(\(|\)|\')/g, " $1 ") // add spaces around all parentheses
    .replace(/\r*\n*\t*/g, "") // discard all whitespace except
    .split(" ") // split based on spaces, spaces will become empty strings
    .filter(s => s.length !== 0); // remove empty strings
};

const parse = tokens => {
  // checks for an empty imput string
  if (tokens.length === 0) {
    console.error("No tokens to parse");
    return 1;
  }

  // checks for incorrect EOF
  if (tokens[0] === ")") {
    console.error("Unexpected end of file");
    return 2;
  }

  if (tokens[0] === "'") {
    tokens.shift();
    let nextTokens = ["quote"];
    nextTokens.push(parse(tokens));

    return nextTokens;
  }

  // start a new block
  if (tokens[0] === "(") {
    tokens.shift(); // remove the starting (
    let nextTokens = []; // create an array for storing a new block
    // until we reach the end of the block
    while (tokens[0] !== ")" && tokens.length) {
      nextTokens.push(parse(tokens)); // parse the block and push it to the array
      tokens.shift(); // remove the token we just parsed from the start
    }
    // tokens.pop(); // remove one closing ) from the end

    return nextTokens; // return the block
  }
  else {
    return atom(tokens[0]); // if nothing else, it is an atom, return it
  }
};

// turns numbers into numbers (int, float), everything else is a string
const atom = token => {
  // return /(\d+( \.\d+)?)/.test(token) ? +token : String(token);
  let atom = /[^\d.]/.test(token) ? String(token) : +token; // 1.4.60 this breaks it!!!!
  if (typeof atom !== "number" && atom.length > 1 && atom.slice(0, 1) === "-" && !/[^\d.]/.test(atom.slice(1)))
    atom = parseInt(atom); // find negative numbers
  return atom;
};

const environment = ({ varNames, args, outer }) => {
  // create an environment object

  let env = {};
  outer = outer || {}; // if an outer env is not supplied, set it to an empty object

  const find = variable => {
    if (env.hasOwnProperty(variable)) {
      // if env has a variable, return it
      return env;
    }
    else {
      // otherwise, try looking for it in the outer env
      return outer.find(variable);
    }
  };

  for (let i = 0; i < varNames.length; i++) {
    env[varNames[i]] = args[i];
  }

  env.find = find;

  return env;
};

// create the global environment
const createGlobals = env => {
  // create a list of all the functions in Math and add them to the env
  // prettier-ignore
  const jsMathFunctions = [
    "abs", "acos", "acosh", "asin",
    "asinh", "atan", "atan2", "atanh",
    "cbrt", "ceil", "clz32", "cos",
    "cosh", "exp", "expm1", "floor",
    "fround", "hypot", "imul", "log",
    "log10", "log1p", "log2", "max",
    "min", "pow", "random", "round",
    "sign", "sin", "sinh", "sqrt",
    "tan", "tanh", "trunc"
  ];

  jsMathFunctions.forEach(fun => (env[fun] = Math[fun]));

  // add all basic math functions, that are not in the Math object and other basic functions
  env["+"] = (a, ...rest) => rest.reduce((res, b) => (res += b), a);
  env["-"] = (a, ...rest) => rest.reduce((res, b) => (res -= b), rest.length ? a : -a);
  env["*"] = (a, ...rest) => rest.reduce((res, b) => (res *= b), a);
  env["/"] = (a, ...rest) => rest.reduce((res, b) => (res /= b), rest.length ? a : 1 / a);
  env[">"] = (a, b) => a > b;
  env["<"] = (a, b) => a < b;
  env[">="] = (a, b) => a >= b;
  env["<="] = (a, b) => a <= b;
  env["="] = (a, b) => a === b;
  env["equal?"] = (a, b) => a === b;

  env["not"] = a => !a;
  env["and"] = (a, ...rest) => rest.reduce((res, b) => res && b, a);
  env["or"] = (a, ...rest) => rest.reduce((res, b) => res || b, a);
  env["car"] = list => list[0];
  env["cdr"] = list => list.slice(1);
  env["cadr"] = list => env["car"](env["cdr"](list)); // could also be just list.slice(1,2);
  env["list"] = (...list) => list;
  env["cons"] = (n, list) => [n, ...list];
  env["length"] = list => list.length;
  // // env["cadr"] = list => list.slice(1, 2);

  env["display"] = a => console.log(a);

  // add basic math constants
  env["PI"] = Math.PI;
  env["E"] = Math.E;
  env["LN10"] = Math.LN10;
  env["LN2"] = Math.LN2;
  env["LOG10E"] = Math.LOG10E;
  env["LOG2E"] = Math.LOG2E;
  env["PI"] = Math.PI;
  env["SQRT1_2"] = Math.SQRT1_2;
  env["SQRT2"] = Math.SQRT2;

  env["#t"] = true;
  env["#f"] = false;

  return env;
};

let globalEnv = createGlobals(environment({ varNames: [], args: [], outer: null }));

// console.log(globalEnv['+'](105, 47));
// console.log(globalEnv["cadr"]([1, 2, 3, 4, 5]));
// console.log(globalEnv["or"](false, false, true, false));

// evaluate AST returned from parser()
// expects an AST node and the current env that is to be used for the evaluation
const eval = (ast, env) => {
  env = env || globalEnv;
  if (typeof ast === "string") {
    // if the entire AST node is a string, it is a variable
    return env.find(ast)[ast]; // if there is a variable by this name in any env, this env gets returned and then the value of the variable is returned
  }
  else if (typeof ast === "number") {
    // it the entire AST node is a constant number, return it
    return ast;
  }
  else if (ast[0] === "quote") {
    return ast[1];
  }
  else if (ast[0] === "define") {
    // the first node of the AST is define
    if (Array.isArray(ast[1])) env[ast[1][0]] = createLambda(ast[1].slice(1), ast[2], env);
    else env[ast[1]] = eval(ast[2], env); // evaluate the third element of the AST node and save it into the env under the second element
  }
  else if (ast[0] === "set!") {
    env[eval(ast[1], env) ? ast[1] : null] = eval(ast[2], env);
  }
  else if (ast[0] === "lambda") {
    // function declaration
    let vars = ast[1]; // expected parameters, eg. function(*A*) {}
    let body = ast[2]; // executable body of the function

    return createLambda(vars, body, env);
  }
  else if (ast[0] === "if") {
    return eval(ast[1], env) === true ? eval(ast[2], env) : eval(ast[3], env);
  }
  else if (ast[0] === "begin") {
    // evaluate all self contained top level blocks, pass down the env -> able to store variables
    let res;
    for (let i = 1; i < ast.length; i++) {
      res = eval(ast[i], env);
    }
    return res;
  }
  else {
    // everything else is a function call
    let args = [];
    for (let i = 0; i < ast.length; i++) {
      // eval all elemnts - the first will return a function
      args[i] = eval(ast[i], env);
    }
    let procedure = args.shift(); // the first argument is the procedure itself

    return procedure.apply(env, args);
  }
};

const createLambda = (vars, body, env) => {
  return function () {
    // works only with 'function' doesn't work with () =>
    return eval(
      body,
      environment({ varNames: vars, args: arguments, outer: env }) // arguments is a variable that contains arguments passed to the function
    ); // returns a func that evaluates the body in a new env with the declared func params and their values (args)
  };
};

const repl = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.setPrompt("> ");
  rl.prompt();

  rl.on("line", input => {
    if (!input) {
      rl.prompt();
      return;
    }
    let ast = parse(tokenize(input));
    console.log(`Received: ${input}`, ast);
    let res = eval(ast);
    res ? console.log(res) : null;

    rl.prompt();
  });

  // rl.on("SIGINT", () => {
  //   rl.question("Are you sure you want to exit? ", answer => {
  //     if (answer.match(/^y(es)?$/i)) rl.pause();
  //   });
  // });
};

repl();

// let ast = parse(tokenize("(begin (define r 1) (define t (- 5 2)) (+ r (* t 2)))"));
// let ast = parse(tokenize("(+ 3 4)"));
// let ast = parse(
//   tokenize("(begin (define area (lambda (r t) (+ r t)) ) (area 4 6) )")
// );
// let ast = parse(tokenize("(begin (define r 30) (define sun_or_snow (lambda (sos) (if (= 4 6) (+ 5 5) (* 5 5)) ) )"));
// let ast = parse(tokenize("(begin ((lambda (r) (* r r)) 6) )"));
// let ast = parse(tokenize("(begin (define r 5) (define r 6) (+ 1 r) )"));
// let ast = parse(tokenize("(begin (not (and (< 7 5) (= 7 7))))"));
// let ast = parse(
//   tokenize(`( begin (define fact
//     (lambda (n)
//       (if (= n 0)                      ;This is another comment:
//           1                            ;Base case: return 1
//           (* n (fact (- n 1)))))) (fact 3))`)
// );
// let ast = parse(
//   tokenize(`( begin (define (fact n)
//   (if (= n 0)                      ;This is another comment:
//       1                            ;Base case: return 1
//       (* n (fact (- n 1))))) (fact 3))`)
// );
// let ast = parse(
//   tokenize(`(begin
//     (display "testahoj")
// )`)
// );
// );
// let ast = parse(tokenize("(begin (define r 30) (* PI (* r r)))"));
// let ast = parse(s
//   tokenize(
//     "(begin ;; this is a comment \n (define area (lambda (r) (* PI (* r r) ) ) )  (area 4) )"
//   )
// );
// (begin (define area (lambda (r)  (* r r) ) ) (area 4) )
// "(begin (define area (lambda (r) (* PI (* r r)))) (area 4))"
// let ast = parse(tokenize("(display 4)"));
// console.log(ast);
// console.log(JSON.stringify(ast));

// let res = eval(ast);
// console.log(res);

// console.log(
//   // JSON.stringify(parse(tokenize(" ( begin (  define r 10) (* pi ( * r r )))")))
//   JSON.stringify(parse(tokenize("(+ 2 3)")))
//   // JSON.stringify(
//   //   parse(
//   //     tokenize(`
//   // (begin
//   //   (define r 1.460)
//   //   (* pi (* r r)))`)
//   //   )
//   // )
//   // JSON.stringify(parse(tokenize("")))
// );
