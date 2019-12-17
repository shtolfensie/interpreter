const tokenize = program => {
  // adds whitespace around brackets, strips all ws except space, splits input string based on spaces
  return program
    .replace(/(\(|\))/g, " $1 ")
    .replace(/\r*\n*\t*/g, "")
    .split(" ")
    .filter(s => s.length !== 0);
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

  // start a new block
  if (tokens[0] === "(") {
    tokens.shift(); // remove the starting (
    let nextTokens = []; // create an array for storing a new block
    // until we reach the end of the block
    while (tokens[0] !== ")" && tokens.length) {
      nextTokens.push(parse(tokens)); // parse the block and push it to the array
      tokens.shift(); // remove the token we just parsed from the start
    }
    tokens.pop(); // remove one closing ) from the end

    return nextTokens; // return the block
  } else {
    return atom(tokens[0]); // if nothing else, it is an atom, return it
  }
};

// turns numbers into numbers (int, float), everything else is a string
const atom = token => {
  // return /(\d+( \.\d+)?)/.test(token) ? +token : String(token);
  let atom = /[^\d.]/.test(token) ? String(token) : +token; // 1.4.60 this breaks it!!!!
  if ((typeof atom !== "number") && atom.length > 1 && atom.slice(0, 1) === '-' && !(/[^\d.]/.test(atom.slice(1)))) atom = parseInt(atom); // find negative numbers
  return atom;
};

const environment = ({ params, args, outer }) => { // create an environment object

  let env = {};
  outer = outer || {}; // if an outer env is not supplied, set it to an empty object


  const find = (variable) => {
    if (env.hasOwnProperty(variable)) { // if env has a variable, return it
      return env;
    }
    else { // otherwise, try looking for it in the outer env
      return outer.find(variable);
    }
  }

  for (let i = 0; i < params.length; i++) {
    env[params[i]] = args[i];
  }

  env.find = find;

  return env;
}

// create the global environment
const createGlobals = (env) => {

  // create a list of all the functions in Math and add them to the env
  const jsMathFunctions = [
    "abs", "acos", "acosh", "asin",
    "asinh", "atan", "atan2", "atanh",
    "cbrt", "ceil", "clz32", "cos",
    "cosh", "exp", "expm1", "floor",
    "fround", "hypot", "imul", "log",
    "log10", "log1p", "log2", "max",
    "min", "pow", "random", "round",
    "sign", "sin", "sinh", "sqrt",
    "tan", "tanh", "trunc"]

  jsMathFunctions.forEach(fun => env[fun] = Math[fun]);

  // add all basic math functions, that are not in the Math object and other basic functions
  env['+'] = (a, b) => a + b;
  env['-'] = (a, b) => a - b;
  env['*'] = (a, b) => a * b;
  env['/'] = (a, b) => a / b;
  env['>'] = (a, b) => a > b;
  env['<'] = (a, b) => a < b;
  env['>='] = (a, b) => a >= b;
  env['<='] = (a, b) => a <= b;
  env['='] = (a, b) => a === b;
  env['equal?'] = (a, b) => a === b;
  env['not'] = (a) => !a;
  env['and'] = (a, b) => a && b;
  env['or'] = (a, b) => a || b;

  // add basic math constants
  env['PI'] = Math.PI;
  env["E"] = Math.E
  env["LN10"] = Math.LN10
  env["LN2"] = Math.LN2
  env["LOG10E"] = Math.LOG10E
  env["LOG2E"] = Math.LOG2E
  env["PI"] = Math.PI
  env["SQRT1_2"] = Math.SQRT1_2
  env["SQRT2"] = Math.SQRT2

  return env;
}

let globalEnv = createGlobals(environment({ params: [], specs: [], outer: null }))

// console.log(globalEnv['+'](105, 47));


// evaluate AST returned from parser()
// expects an AST node and the current env that is to be used for the evaluation
const evaluate = (ast, env) => {
  env = env || globalEnv;
  if (typeof ast === 'string') { // if the entire AST node is a string, it is a variable
    return env.find(ast)[ast]; // if there is a variable by this name in any env, this env gets returned and then the value of the variable is returned
  }
  else if (typeof ast === "number") { // it the entire AST node is a constant number, return it
    return ast;
  }
  else if (ast[0] === 'define') { // the first node of the AST is define
    env[ast[1]] = evaluate(ast[2], env); // evaluate the third element of the AST node and save it into the env under the second element
  }
  else if (ast[0] === 'begin') {
    let res;
    for (let i = 1; i < ast.length; i++) {
      res = evaluate(ast[i], env);
    }
    return res;
  }
  else {
    let args = [];
    for (let i = 0; i < ast.length; i++) {
      args[i] = evaluate(ast[i], env);
    }
    let procedure = args.shift();

    return procedure.apply(null, args);
  }
}

// let ast = parse(tokenize("(begin (define r 1) (define t (- 5 2)) (+ r (* t 2)))"));
// let ast = parse(tokenize("(hypot 3 4)"));
// let ast = parse(tokenize("(begin (+ -456 -30))"));
// let ast = parse(tokenize("(begin (define r 30) (define pi 3.14159) (* pi (* r r)))"));
// let ast = parse(tokenize("(begin (define r 30) (* PI (* r r)))"));
let ast = parse(tokenize("(abs -4)"));
console.log(ast);

let res = evaluate(ast);
console.log(res);


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

const interpreter_schemy = (program) => {
  let ast = parse(tokenize(program));
  return { ast, output: evaluate(ast) }

}

export default interpreter_schemy;