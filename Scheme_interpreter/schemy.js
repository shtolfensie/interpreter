const readline = require("readline");

const QUOTE = "quote",
      QUASI_QUOTE = "quasiquote",
      UNQUOTE = "unquote";

const error = (msg = "Syntax error") => {
  throw msg;
};

const quoteList = { "'": QUOTE, "`": QUASI_QUOTE, ",": UNQUOTE };

const Parser = program => {
  let lines = program.split("\n");
  let line = 0;

  const parse = token => {
    if (token === "(" || token === '[') {
      let next_tokens = [], blockType = token === '(' ? 'P' : 'B';
      while (true) {
        token = get_next_token();
        if (token === ")" && blockType === 'P') return next_tokens;
        else if (token === ')') error('Syntax error: missing `]` to close preceding `[`, found `)` instead.');
        else if (token === ']' && blockType === 'B') return next_tokens;
        else if (token === ']') error('Syntax error: missing `)` to close preceding `(`, found `]` instead.');
        else next_tokens.push(parse(token));
      }
    }
    else if (token === ")") error("Unexpected end of s-expression");
    else if (quoteList.hasOwnProperty(token)) return [ quoteList[token], parse(get_next_token()) ];
    else if (token === "EOF") error("Unexpected end of file");
    else return atom(token);
  };

  const get_next_token = () => {
    const tokenizerRegEx = /\s*(,@|[(\['`,\])]|"(?:[\\].|[^\\"])*"|;.*|[^\s(\['"`,;\])]*)(.*)/;
    let token;

    while (true) {
      if (lines[line] === "") line++;
      if (!lines[line] || line > lines.length - 1) return "EOF";
      [ , token, lines[line] ] = tokenizerRegEx.exec(lines[line]);
      if (token !== "" && token[0] !== ";") return token;
    }
  };

  let tokens = [];
  do {
    do {
      let token = get_next_token();
      if (token) tokens.push(parse(token));
    } while (lines[line] !== "");
  } while (lines[line + 1] !== "" && line + 1 < lines.length);
  if (tokens) return tokens;
  else return "EOF";
};

const atom = token => {
  if (token[0] === '"') return token;
  if (token === "#t" || token === "#f") return token[1] === "t" ? true : false;
  if (!Number.isNaN(+token)) return +token;
  return token;
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
  env["cons"] = (n, list) => [ n, ...list ];
  env["length"] = list => list.length;
  // // env["cadr"] = list => list.slice(1, 2);

  env["display"] = a => console.log(toSchemeDisplayString(a));
  env["apply"] = (callable, ...args) => {
    let list = args.pop();
    args = [ ...args, ...list ];
    return callable.apply(null, args);
  };

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
  if (ast[0] === '"') return ast; // if ast is a string, return it
  else if (ast[0] === "#" && ast[1] === "\\") return ast; // if ast is a char, return it
  else if (typeof ast === 'boolean') return ast;
  else if (typeof ast === "string") {
    // if the entire AST node is a string, it is a variable
    return env.find(ast)[ast]; // if there is a variable by this name in any env, this env gets returned and then the value of the variable is returned
  }
  else if (typeof ast === "number") {
    // if the entire AST node is a constant number, return it
    return ast;
  }
  else if (ast[0] === "quote") {
    // if the first alement is 'quote', return the second one
    return ast[1];
  }
  else if (ast[0] === "quasiquote") {
    return evalQuasiQuote(ast, env);
  }
  else if (ast[0] === "define") {
    // the first node of the AST is define
    if (Array.isArray(ast[1])) env[ast[1][0]] = createLambda(ast[1].slice(1), ast.slice(2), env);
    else env[ast[1]] = eval(ast[2], env); // evaluate the third element of the AST node and save it into the env under the second element
  }
  else if (ast[0] === "set!") {
    env.find(ast[1])[ast[1]] = eval(ast[2], env); // find the env where the variable is, and modify it
  }
  else if (ast[0] === "lambda") {
    // function declaration
    let vars = ast[1]; // expected parameters, eg. function(*A*) {}
    let bodyArray = ast.slice(2); // executable bodies of the function

    return createLambda(vars, bodyArray, env);
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
  else if (ast[0] === 'let') {
    let envDefObj = {varNames: [], args: [], outer: env};
    ast[1].forEach(varInit => {envDefObj.varNames.push(varInit[0]); envDefObj.args.push(eval(varInit[1], env))})
    let newEnv = environment(envDefObj);
    return eval(['begin', ...ast.slice(2)], newEnv);
  }
  else if (ast[0] === 'let*') {
    let newEnv = environment({varNames: [], args: [], outer: env});
    ast[1].forEach(varInit => newEnv[varInit[0]] = eval(varInit[1], newEnv));
    return eval(['begin', ...ast.slice(2)], newEnv);
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

const createLambda = (vars, bodyArray, env) => {
  // works only with 'function' doesn't work with () =>
  return function() {
    let args = Array.from(arguments), varNames = vars, res; // arguments is a variable that contains arguments passed to the function 
    if (vars[vars.length - 2] === '.') {
      args = [...args.slice(0, vars.length - 2), args.slice(vars.length - 2)];
      varNames = [...vars.slice(0, vars.length - 2), vars[vars.length - 1]]
    }
    let newEnv = environment({ varNames, args, outer: env });
    bodyArray.forEach(body => res = eval( body, newEnv )); // returns a func that evaluates the body in a new env with the declared func params and their values (args)
    return res;
  };
};

const evalQuasiQuote = (ast, env, lvl = 0) => {
  // `x => 'x; ,x => x; `(,@x y) => (append x y)
  if (ast.length === 0) return [];
  if (!Array.isArray(ast)) return ast;
  if (ast[0] === QUASI_QUOTE && lvl === 0) return evalQuasiQuote(ast[1], env, ++lvl);
  else if (ast[0] === QUASI_QUOTE) return [ ast[0], ...Array.from(evalQuasiQuote(ast.slice(1), env, ++lvl)) ];
  if (ast[0] === UNQUOTE && lvl === 1) return eval(ast[1], env);
  else if (ast[0] === UNQUOTE) return [ ast[0], ...Array.from(evalQuasiQuote(ast.slice(1), env, --lvl)) ];
  if (Array.isArray(ast))
    return [ evalQuasiQuote(ast[0], env, lvl), ...Array.from(evalQuasiQuote(ast.slice(1), env, lvl)) ];
};

const toSchemeDisplayString = (ast, lvl = false) => {
  if (typeof ast === "string") return (ast[0] === '"' && ast[ast.length-1] === '"') ? ast : lvl ? `'${ast}` : ast;
  else if (typeof ast === "number") return `${ast}`;
  else if (typeof ast === "function") return `#<procedure>`;
  else if (typeof ast === "boolean") return ast ? "#t" : "#f";
  else if (Array.isArray(ast)) {
    if (Array.from(Object.values(quoteList)).includes(ast[0]))
      return `${Array.from(Object.entries(quoteList)).filter(pair => pair[1] === ast[0])[0][0]}${ast
        .slice(1)
        .map(list => toSchemeDisplayString(list))
        .join(" ")}`;
    return `${lvl ? "'" : ''}(${ast.map(list => toSchemeDisplayString(list)).join(" ")})`;
  }
};

const repl = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log("Welcome to Schemy!");
  rl.setPrompt("> ");
  rl.prompt();

  rl.on("line", input => {
    if (!input) {
      rl.prompt();
      return;
    }

    let ast = Parser(input);
    // console.log(ast);

    let res = ast.map(node => eval(node)).pop();

    res !== undefined ? console.log(toSchemeDisplayString(res, true)) : null;

    rl.prompt();
  });

  // rl.on("SIGINT", () => {
  //   rl.question("Are you sure you want to exit? ", answer => {
  //     if (answer.match(/^y(es)?$/i)) rl.pause();
  //   });
  // });
};

repl();

// let ast = Parser("`(a `(b ,(+ 1 2) ,(foo ,(+ 1 3) d) e) f)");
// let ast = Parser("(let ([x 5]) (let ([x 2] [y x]) (list y x)))");

// let ast = Parser(`
//   (define x 10)
//   x
//   (define str "Hello th\\"ere")
//   (display str)
//   (define (double c) (begin (define x 45) (+ c x) ))
//   (double x)`);

// let ast = parse(
//   tokenize(
//     "(begin (define (count item L) (if (> (length L) 0) (begin (display L) (+ (if (equal? item (car L)) 1 0) (count item (cdr L)) ) ) 0 )) (count 0 '(0 1 2 0 3 0)) )"
//   )
// );
// let ast = parse(tokenize("(begin (define r 1) (define t (- 5 2)) (+ r (* t 2)))"));
// let ast = parse(
//   tokenize(
//     "(begin (define make-account (lambda (balance) (lambda (amt) (begin (set! balance (+ balance amt))  balance)))) (define account1 (make-account 100.00)) (account1 -20) (account1 -30))"
//   )
// );
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
// let res = ast.map(node => eval(node)).pop();
// res !== undefined ? console.log(toSchemeDisplayString(res, true)) : null;

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
