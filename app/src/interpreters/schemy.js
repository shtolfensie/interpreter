// const readline = require("readline");

const QUOTE = "quote",
      QUASI_QUOTE = "quasiquote",
      UNQUOTE = "unquote",
      UNQUOTE_SPLICING = "unquote-splicing";

const error = (msg = "Syntax error") => {
  throw msg;
};

const quoteList = { "'": QUOTE, "`": QUASI_QUOTE, ",": UNQUOTE, ",@": UNQUOTE_SPLICING };

const Parser = program => {
  let lines = program.split("\n").map(line => line.trim()).filter(line => line.length > 0);
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
    else if (token === ")" || token === "]") error("Unexpected end of s-expression");
    else if (quoteList.hasOwnProperty(token)) return [ quoteList[token], parse(get_next_token()) ];
    else if (token === "EOFCOMMENT") return;
    else if (token === "EOF") error("Unexpected end of file");
    else return atom(token);
  };

  const get_next_token = () => {
    const tokenizerRegEx = /\s*((?:#\\.)|,@|[(\['`,\])]|"(?:[\\].|[^\\"])*"|;.*|[^\s(\['"`,;\])]*)(.*)/;
    let token;

    while (true) {
      if (lines[line] === "") line++;
      if (!lines[line] || line > lines.length - 1) return "EOF";
      [ , token, lines[line] ] = tokenizerRegEx.exec(lines[line]);
      if (token === "") error(`Syntax error: ${lines[line]}`);
      if (token[0] !== ";") return token; // used to be token !== "" && token[0] !== ";"
      else if (token[0] === ";" && line+1 > lines.length-1) return "EOFCOMMENT";
    }
  };

  let tokens = [];
  do {
    do {
      let token = get_next_token();
      if (token) tokens.push(parse(token));
    } while (lines[line] !== "");
  } while (lines[line + 1] !== "" && line + 1 < lines.length);
  if (tokens) return tokens.filter(ts => ts !== undefined);
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
  outer = outer || {find: v => ({[v] : null})}; // if an outer env is not supplied, set it to an empty env

  const find = variable => {
    if (env.hasOwnProperty(variable)) {
      // if env has a variable, return it
      return env;
    }
    else {
      // otherwise, try looking for it in the outer env
      // return Object.entries(outer).length !== 0 ? outer.find(variable) : null;
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
  env["+"] = (a, ...rest) => rest.reduce((res, b) => (res += b), parseInt(a ? a : 0 +0)); // parseInt and the cond inside is to handle an empty arr or no args at all - eg. (apply + '())
  env["-"] = (a, ...rest) => rest.reduce((res, b) => (res -= b), rest.length ? a : -a);
  env["*"] = (a, ...rest) => rest.reduce((res, b) => (res *= b), a);
  env["/"] = (a, ...rest) => rest.reduce((res, b) => (res /= b), rest.length ? a : 1 / a);
  env["modulo"] = (a, b) => a % b; 
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
  env["cons"] = (n, list) => [ n,  ...(Array.isArray(list) ? list : [list])]; // to keep to MIT implementation - the last element doesnt need to be a list
  env["append"] = (...lists) => lists.reduce((res, l) => [...res, ...l]);
  env["list-ref"] = (list, k) => list[k];
  env["reverse"] = list => [...list].reverse(); // reverse returns a new list, doesn't modify the original
  env["reverse!"] = list => list.reverse(); // reverse! modifies the list in place
  env["length"] = list => Array.isArray(list) ? list.length : error(`Syntax Error: at procedure: length, expected: list, given: ${toSchemeWriteString(list)}`);
  env["map"] = (callable, ...lists) => {
    lists.reduce((acc, l) => {
      if (!Array.isArray(l)) error(`Syntax Error: at procedure: map, expected: list, given: ${toSchemeWriteString(l)}`);
      if (acc === -1) acc = l.length;
      if (acc !== l.length) error (`Syntax Error: at procedure: map, all lists need to be the same length`);
      return acc;
    }, -1);
    let res = [];
    for (let i = 0; i < lists[0].length; i++) {
      let currArgs = [];
      for (let j = 0; j < lists.length; j++) {
        currArgs.push(lists[j][i]);
      }
      res.push(callable.apply(null, currArgs))
    }
    return res;
  }
  env["null?"] = list => Array.isArray(list) && list.length === 0;
  env["list?"] = list => Array.isArray(list);
  env["integer?"] = a => Number.isInteger(a);

  env["display"] = a => setOutput(toSchemeDisplayString(a));
  env["write"] = a => setOutput(toSchemeWriteString(a, true));
  env["write-line"] = a => setOutput(toSchemeWriteString(a, true)+'\n');
  env["newline"] = () => setOutput('\n');
  env["apply"] = (callable, ...args) => {
    let list = args.pop();
    // to prevent an error when trying to ...spread a variable that is not an array. To enforce the syntax - last arg must be a list
    if (!Array.isArray(list)) error(`Syntax Error: at procedure: apply, expected: list, given: ${toSchemeWriteString(list)} `)
    args = [ ...args, ...list ];
    return callable.apply(null, args);
  };
  env["void"] = () => {}
  env["error"] = (...m) => error(m.reduce((acc, cur) => acc += toSchemeDisplayString(cur)+" " , ""))

  // string procedures
  env["string?"] = s => typeof s === "string" && s[0] === '"' && s[s.length-1] === '"';
  env["make-string"] = (k, c) => typeof k === "number" ? toString(new Array(Math.floor(k)).fill(env["char?"](c) ? getStringValue(env["char->name"](c)) : '-').join('')) : error(`Syntax Error: at procedure: make-string, expected 'length' to be a number, given: ${toSchemeWriteString(k)}`);
  env["string"] = (...chars) => toString(chars.map(c => getStringValue(env["char->name"](c))).join(''));
  env["string-append"] = (...strings) => toString(strings.reduce((acc, s) => env["string?"](s)? acc+=getStringValue(s) : error(`Syntax error: at procedure: string-append, expected: string, given: ${toSchemeWriteString(s)}`), ""));
  env["string-length"] = s => env["string?"](s) ? getStringValue(s).length : error(`Syntax error: at procedure: string-length, expected: string, given: ${toSchemeWriteString(s)}`);
  env["string-ref"] = (string, k) => env["string?"](string) ? (k < string.length-2 && k >= 0) ? toChar(getStringValue(string)[k]) : error(`${k} not in correct range`) : error(`Syntax error: at procedure: string-ref, expected: string, given: ${toSchemeWriteString(string)}`);
  env["substring"] = (string, s, e) => env["string?"](string) ? ((s<=string.length-2&&s>=0)&&(e<=string.length-2&&e>=0)) ? toString(getStringValue(string).slice(s, e)) : error(`${s?s:''}${s&&e?' and/or ':''}${e?e:''} not in correct range`) : error(`Syntax error: at procedure: substring, expected: string, given: ${toSchemeWriteString(string)}`);;
  env["string->list"] = string => env["string?"](string) ? getStringValue(string).split('').map(c => toChar(c)) : error(`Syntax error: at procedure: string->list, expected: string, given: ${toSchemeWriteString(string)}`);
  env["list->string"] = list => env["list?"](list) ? toString(list.map(c => getStringValue(env["char->name"](c))).reduce((acc, c) => acc+=c, "")) : error(`Syntax error: at procedure: list->string, expected: list, given: ${toSchemeWriteString(list)}`);
  env["number->string"] = num => typeof num !== 'number' ? error(`Syntax error: at procedure: number->string, expected: number, given: ${toSchemeWriteString(num)}`) : '"'+num+'"';

  // char procedures
  env["char?"] = c => typeof c === 'string' && c.length === 3 && c[0] === '#' && c[1] === '\\';
  env["char->name"] = c => env["char?"](c) ? toString(getCharValue(c)) : error(`Syntax error: at procedure: char->name, expected: char, given: ${toSchemeWriteString(c)}`);
  env["name->char"] = s => env["string?"](s) ? s.length-2 === 1 ? toChar(getStringValue(s)) : error(`Syntax error: at procedure: name->char, string needs to be one char`) : error(`Syntax error: at procedure: name->char, expected: string, given: ${toSchemeWriteString(s)}`);
  env["char-upcase"] = c => env["char?"](c) ? toChar(getCharValue(c).toUpperCase()) : error(`Syntax error: at procedure: char-upcase, expected: char, given: ${toSchemeWriteString(c)}`);
  env["char-downcase"] = c => env["char?"](c) ? toChar(getCharValue(c).toLowerCase()) : error(`Syntax error: at procedure: char-downcase, expected: char, given: ${toSchemeWriteString(c)}`);
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
const getStringValue = string => string.slice(1, string.length-1);
const getCharValue = char => char.slice(2);
const toString = char => '"'+char+'"';
const toChar = s => "#\\"+s;
// evaluate AST returned from parser()
// expects an AST node and the current env that is to be used for the evaluation
const evaluate = (ast, env) => {
  env = env || globalEnv;
  if (ast[0] === '"') return ast; // if ast is a string, return it
  else if (ast[0] === "#" && ast[1] === "\\") return ast.length === 3 ? ast : error(`Bad character constant: ${ast}`); // if ast is a char, return it
  else if (typeof ast === 'boolean') return ast;
  else if (typeof ast === "string") {
    // if the entire AST node is a string, it is a variable
    let variable = env.find(ast)[ast];
    checkVariable(variable, {varName: ast});
    return variable; // if there is a variable by this name in any env, this env gets returned and then the value of the variable is returned
  }
  else if (typeof ast === "number") {
    // if the entire AST node is a constant number, return it
    return ast;
  }
  else if (ast[0] === "quote") {
    // if the first alement is 'quote', return the second one
    checkQuote(ast);
    return ast[1];
  }
  else if (ast[0] === "quasiquote") {
    checkQuote(ast);
    return evalQuasiQuote(ast, env);
  }
  else if (ast[0] === "define") {
    // the first node of the AST is define
    checkDefine(ast);
    if (ast.length === 2) env[ast[1]] = undefined;
    else if (Array.isArray(ast[1])) env[ast[1][0]] = createLambda(ast[1].slice(1), ast.slice(2), env);
    else env[ast[1]] = evaluate(ast[2], env); // evaluate the third element of the AST node and save it into the env under the second element
  }
  else if (ast[0] === "set!") {
    checkSet(ast);
    checkVariable(env.find(ast[1])[ast[1]], {varName: ast[1], ast}, true);
    env.find(ast[1])[ast[1]] = evaluate(ast[2], env); // find the env where the variable is, and modify it
  }
  else if (ast[0] === "set-car!") {
    checkSetList(ast);
    checkVariable(env.find(ast[1])[ast[1]], {varName: ast[1], ast}, true);
    env.find(ast[1])[ast[1]][0] = evaluate(ast[2], env);
  }
  else if (ast[0] === "set-cdr!") {
    checkSetList(ast);
    checkVariable(env.find(ast[1])[ast[1]], {varName: ast[1], ast}, true);
    let secondVar = evaluate(ast[2]);
    env.find(ast[1])[ast[1]] = [evaluate(ast[1], env)[0], ...(Array.isArray(secondVar) ? secondVar : [secondVar])]
  }
  else if (ast[0] === "lambda") {
    // function declaration
    let vars = ast[1]; // expected parameters, eg. function(*A*) {}
    let bodyArray = ast.slice(2); // executable bodies of the function
    checkLambda(vars, bodyArray, ast);
    return createLambda(vars, bodyArray, env);
  }
  else if (ast[0] === "if") {
    checkIf(ast);
    return evaluate(ast[1], env) !== false ? evaluate(ast[2], env) : evaluate(ast[3], env);
  }
  else if (ast[0] === "cond") {
    checkCond(ast);
    let clauseArray = ast.slice(1);
    for (let i = 0; i < clauseArray.length; i++) {
      if (clauseArray[i][0] === 'else') return checkCondElseClause(clauseArray[i], ast) ? evaluate(['begin', ...clauseArray[i].slice(1)], env) : null;
      let predicateRes = evaluate(clauseArray[i][0], env);
      if (predicateRes !== false) {
        if (clauseArray[i].length === 1) return predicateRes;
        return evaluate(['begin', ...clauseArray[i].slice(1)], env);
      }
    }
  }
  else if (ast[0] === "begin") {
    // evaluate all self contained top level blocks, pass down the env -> able to store variables
    let res;
    for (let i = 1; i < ast.length; i++) {
      res = evaluate(ast[i], env);
    }
    return res;
  }
  else if (ast[0] === 'let') {
    let varNames = [], args = [], name;
    checkLet(ast);
    if (!Array.isArray(ast[1])) {
      name = ast[1];
      ast = [ast[0], ...ast.slice(2)];
    }
    ast[1].forEach(varInit => {varNames.push(varInit[0]); args.push(evaluate(varInit[1], env))})
    let lambda = createLambda(varNames, ast.slice(2), env);
    // name ? env[name] = lambda : null;
    if (name) env[name] = lambda;
    return lambda.apply(env, args);
  }
  else if (ast[0] === 'let*') {
    checkLet(ast, true);
    let newEnv = environment({varNames: [], args: [], outer: env});
    ast[1].forEach(varInit => newEnv[varInit[0]] = evaluate(varInit[1], newEnv));
    return evaluate(['begin', ...ast.slice(2)], newEnv);
  }
  else {
    // everything else is a function call
    let args = [];
    for (let i = 0; i < ast.length; i++) {
      // eval all elemnts - the first will return a function
      args[i] = evaluate(ast[i], env);
    }
    let procedure = args.shift(); // the first argument is the procedure itself
    checkProcedure(procedure, ast);

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
    else if (vars.length !== args.length) error(`#<procedure>: arity mismatch: the expected number of arguments does not match the given number; expected: ${vars.length}; given: ${args.length}`);
    let newEnv = environment({ varNames, args, outer: env });
    bodyArray.forEach(body => res = evaluate( body, newEnv )); // returns a func that evaluates the body in a new env with the declared func params and their values (args)
    return res;
  };
};

const evalQuasiQuote = (ast, env, lvl = 0) => {
  // `x => 'x; ,x => x; `(,@x y) => (append x y)
  if (ast.length === 0) return [];
  if (!Array.isArray(ast)) return ast;
  if (ast[0] === QUASI_QUOTE && lvl === 0) return evalQuasiQuote(ast[1], env, ++lvl);
  else if (ast[0] === QUASI_QUOTE) return [ ast[0], ...Array.from(evalQuasiQuote(ast.slice(1), env, ++lvl)) ];
  if (ast[0] === UNQUOTE && lvl === 1) return evaluate(ast[1], env);
  else if (ast[0] === UNQUOTE) return [ ast[0], ...Array.from(evalQuasiQuote(ast.slice(1), env, --lvl)) ];
  if (ast[0] === UNQUOTE_SPLICING && lvl > 1) return [ ast[0], ...Array.from(evalQuasiQuote(ast.slice(1), env, --lvl)) ];
  if (Array.isArray(ast)) {
    if (ast[0][0] === UNQUOTE_SPLICING && lvl === 1) {
      const resultList = evaluate(ast[0].slice(1)[0], env);
      if (!Array.isArray(resultList) || resultList.length === 0) error(`Splicing Error: at: ${toSchemeWriteString(ast[0])}, expected a list, given: ${resultList}`);
      return [ ...resultList, ...Array.from(evalQuasiQuote(ast.slice(1), env, lvl)) ];
    }
    return [ evalQuasiQuote(ast[0], env, lvl), ...Array.from(evalQuasiQuote(ast.slice(1), env, lvl)) ];
  }
};

const toSchemeWriteString = (ast, lvl = false) => {
  if (typeof ast === "string") return ((ast[0] === '"' && ast[ast.length-1] === '"')
                                      || (ast[0] === '#' && ast[1] === '\\' && ast.length === 3)) ? ast
                                        : lvl ? `'${ast}`
                                          : ast;
  else if (typeof ast === "number") return `${ast}`;
  else if (typeof ast === "function") return `#<procedure>`;
  else if (typeof ast === "boolean") return ast ? "#t" : "#f";
  else if (Array.isArray(ast)) {
    if (Array.from(Object.values(quoteList)).includes(ast[0]))
      return `${lvl ? "'" : ""}${Array.from(Object.entries(quoteList)).filter(pair => pair[1] === ast[0])[0][0]}${ast
        .slice(1)
        .map(list => toSchemeWriteString(list))
        .join(" ")}`;
    return `${lvl ? "'" : ''}(${ast.map(list => toSchemeWriteString(list)).join(" ")})`;
  }
};

const unescaper = (match, g1) => {
  switch (g1) {
    case 'n':
      return '\n';
    case 't':
      return '\t';
    case 'r':
      return '\r';
    case '"':
    case "'":
    case '\\':
      return g1;
    default:
      break;
  }
}
const toSchemeDisplayString = (ast) => {
  if (typeof ast === "string") return (ast[0] === '#' && ast[1] === '\\' && ast.length === 3) ? ast[2]
                                      : (ast[0] === '"' && ast[ast.length-1] === '"') ? ast.slice(1, ast.length-1).replace(/\\([ntr"'\\])/g, unescaper) : ast;
  else if (typeof ast === "number") return `${ast}`;
  else if (typeof ast === "function") return `#<procedure>`;
  else if (typeof ast === "boolean") return ast ? "#t" : "#f";
  else if (Array.isArray(ast)) {
    if (Array.from(Object.values(quoteList)).includes(ast[0]))
      return `${Array.from(Object.entries(quoteList)).filter(pair => pair[1] === ast[0])[0][0]}${ast
        .slice(1)
        .map(list => toSchemeDisplayString(list))
        .join(" ")}`;
    return `(${ast.map(list => toSchemeDisplayString(list)).join(" ")})`;
  }
}

const isSymbol = s => typeof s === "string" &&  !(/^#\\|^".*("$)|^#/.test(s));
const checkVariable = (variable, {varName, ast}, fromSet) => {
  if (variable === undefined && !fromSet) return error(`Unassigned variable: ${varName}`);
  else if (variable === null) return error(`Unbound symbol: ${varName}${ast ? `, at ${toSchemeWriteString(ast)}` : ""}`);
}
const checkQuote = ast => ast.length !== 2 ? error(`Syntax error: quote: ${ast.length === 1 ? "no arguments" : "too many arguments"}`) : null;
const checkDefine = ast => {
  let msg = '';
  let astString = toSchemeWriteString(ast);
  if (ast.length < 2) msg = `not enough arguments, at ${astString}`;
  else if (!Array.isArray(ast[1]) && !isSymbol(ast[1])) msg =`not an identifier, at: ${ast[1]}, in: ${astString}`;
  else if (Array.isArray(ast[1])) {
    if (ast.length < 3) msg = `no lambda expressins, at: ${astString}`
    ast[1].forEach(v => !isSymbol(v) ? msg += `${msg ? '; ' : ''}not an identifier, at: ${v}, in ${astString}` : null);
  }
  if (msg) error(`Syntax error: define: ${msg}`);
}
const checkSet = ast => ast.length !== 3 ? error(`Syntax error: set!: ${ast.length === 1 ? "no arguments" : ast.length === 2 ? "not enough arguments" : "too many arguments"} `) :null;
const checkSetList = ast => {if (ast.length !== 3) error(`Syntax error: ${ast[0]}`);}
const checkLambda = (vars, bodyArray, ast) =>  {
  let msg = "";
  if (ast.length < 3) {
    if (ast.length === 1) msg = "no formals or expressions";
    else if (!Array.isArray(vars)) msg = "no formals definition";
    else if (bodyArray.length === 0) msg = "no expressions"
  }
  else if (!Array.isArray(vars)) msg = "missing () around formals definition";
  else vars.forEach(v => !isSymbol(v) ? msg = `not an identifier, at: ${v}` : null);
  if (msg) error(`Syntax error: lambda: ${msg}, in ${toSchemeWriteString(ast)}`);
}
const checkIf = ast => ast.length !== 4 ? error(`Syntax error: if: invalid number of argumnets`) : null;
const checkCond = ast => !(ast.length > 1) ? error("Syntax error: cond: no clauses provided")
                          : ast.slice(1).forEach(c => !Array.isArray(c) ? error(`Syntax error: cond: clause is not a test-value pair, at: ${toSchemeWriteString(c)}`):null);
const checkCondElseClause = (clause, cond) => clause.length < 2 ? error(`Syntax error: cond: missing expressions in 'else' clause, at: ${toSchemeWriteString(cond)}`):true;
const checkLet = (ast, fromLetStar = false) => {
  let msg = '', astString = toSchemeWriteString(ast);
  if (!Array.isArray(ast[1]) && !fromLetStar) {
    if (!isSymbol(ast[1])) msg = `named-let: 'name' not an identifier, at: ${ast[1]}, in: ${astString}`;
    ast = [ast[0], ...ast.slice(2)];
  }
  if (!Array.isArray(ast[1])) msg += `${msg?"; ":""}let: not a list of bindings at: ${ast[1]}, in: ${astString}`;
  else ast[1].forEach(pair => {
    console.log(pair)
    if (!Array.isArray(pair)) msg += `${msg?"; ":""}let: not an identifier expression for a binding at: ${pair}, in: ${astString}`;
    if (!isSymbol(pair[0])) msg += `${msg?"; ":""}let: not an identifier at: ${pair[0]}, in ${astString}`;
    if (pair.length !== 2) msg += `${msg?"; ":""}let: not and identifier expression for a binding at: ${pair}, in: ${astString}`;
  });
  if (ast.length < 3) msg += `${msg?"; ":""}let: missing body, in: ${astString}`;
  if (msg) error(`Syntax error: ${msg}`);
}
const checkProcedure = (procedure, ast) => typeof procedure !== 'function' ? error(`Application error: '${ast[0]}' is not a procedure, at: ${toSchemeWriteString(ast)}`) : null;

// const repl = () => {
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
//   });

//   console.log("Welcome to Schemy!");
//   rl.setPrompt("> ");
//   rl.prompt();

//   rl.on("line", input => {
//     if (!input) {
//       rl.prompt();
//       return;
//     }

//     let error = '';
//     let ast = undefined;
//     let res = undefined;
//     try {
//       ast = Parser(input);
//       ast.forEach(node => res = evaluate(node));
//     } catch (err) {
//       error = err;
//     }

//     if (res !== undefined) console.log(toSchemeDisplayString(res, true));
//     if (error) console.error(`\x1b[31m${error}\x1b[0m`);

//     rl.prompt();
//   });

//   // rl.on("SIGINT", () => {
//   //   rl.question("Are you sure you want to exit? ", answer => {
//   //     if (answer.match(/^y(es)?$/i)) rl.pause();
//   //   });
//   // });
// };

// repl();
let output = [];
const setOutput = s => {output.push(s); return;}
class Interpreter {
  constructor(fileName, env) {
    this.filaName = fileName;
    this.parser = Parser;
    if (env) globalEnv = env;
    else globalEnv = createGlobals(environment({ varNames: [], args: [], outer: null }));
    console.log('new inter', globalEnv);
    this.evaluate = evaluate;
    this.error = '';
    this.ast = undefined;
    this.res = undefined;
    output = [];
  }
  get interpretedFile() {
    return this.filaName;
  }
  get env() {
    return globalEnv;
  }
  get emptyEvn() {
    return createGlobals(environment({ varNames: [], args: [], outer: null }));
  }
  interpret(input) {
    try {
      this.error = '';
      this.res = '';
      output = [];
      this.ast = this.parser(input);
      this.ast.forEach(node => this.res = this.evaluate(node));
    } catch (err) {
      this.error = err;
    }
    console.log(typeof this.error)
    if (this.error instanceof TypeError) this.error = this.error.stack.split('\n').slice(0,2).join('\n');
    else if (typeof this.error !== "string") this.error = ''+this.error;
    return {res: toSchemeWriteString(this.res, true), output: output.join(''), error: this.error, ast: this.ast}
  }
}

export default Interpreter;

// let ast = Parser("(cond ([< 3 2] 4) ([= 0 0] (begin (define x 10) (display x))))")
// let ast = Parser("''`(a `(b ,(+ 1 2) ,(foo ,(+ 1 3) d) e) f)");
// let ast = Parser("'`a");
// let ast = Parser("(let ([x 5]) (let ([x 2] [y x]) (list y x)))");
// let ast = Parser(`(define quote 4)`);
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
