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


let text = `const createGlobals = (env) => {\r\n\r\n  \/\/ create a list of all the functions in Math and add them to the env\r\n  const jsMathFunctions = [\r\n    \"abs\", \"acos\", \"acosh\", \"asin\",\r\n    \"asinh\", \"atan\", \"atan2\", \"atanh\",\r\n    \"cbrt\", \"ceil\", \"clz32\", \"cos\",\r\n    \"cosh\", \"exp\", \"expm1\", \"floor\",\r\n    \"fround\", \"hypot\", \"imul\", \"log\",\r\n    \"log10\", \"log1p\", \"log2\", \"max\",\r\n    \"min\", \"pow\", \"random\", \"round\",\r\n    \"sign\", \"sin\", \"sinh\", \"sqrt\",\r\n    \"tan\", \"tanh\", \"trunc\"]\r\n\r\n  jsMathFunctions.forEach(fun => env[fun] = Math[fun]);\r\n\r\n  \/\/ add all basic math functions, that are not in the Math object and other basic functions\r\n  env[\'+\'] = (a, b) => a + b;\r\n  env[\'-\'] = (a, b) => a - b;\r\n  env[\'*\'] = (a, b) => a * b;\r\n  env[\'\/\'] = (a, b) => a \/ b;\r\n  env[\'>\'] = (a, b) => a > b;\r\n  env[\'<\'] = (a, b) => a < b;\r\n  env[\'>=\'] = (a, b) => a >= b;\r\n  env[\'<=\'] = (a, b) => a <= b;\r\n  env[\'=\'] = (a, b) => a === b;\r\n  env[\'equal?\'] = (a, b) => a === b;\r\n  env[\'not\'] = (a) => !a;\r\n  env[\'and\'] = (a, b) => a && b;\r\n  env[\'or\'] = (a, b) => a || b;\r\n\r\n  \/\/ add basic math constants\r\n  env[\'PI\'] = Math.PI;\r\n  env[\"E\"] = Math.E\r\n  env[\"LN10\"] = Math.LN10\r\n  env[\"LN2\"] = Math.LN2\r\n  env[\"LOG10E\"] = Math.LOG10E\r\n  env[\"LOG2E\"] = Math.LOG2E\r\n  env[\"PI\"] = Math.PI\r\n  env[\"SQRT1_2\"] = Math.SQRT1_2\r\n  env[\"SQRT2\"] = Math.SQRT2\r\n\r\n  return env;\r\n}`


console.log(text);
