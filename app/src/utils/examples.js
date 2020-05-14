const exampleFiles = {
  GenFBId: {
    "cells":[
      {
        "ast":"",
        "error":"",
        "input":"(define (get-matches num factors/words)\n\t(if (null? factors/words)\n\t\t'()\n\t\t(if (= 0 (modulo num (car (car factors/words))))\n\t\t\t(append (cdr (car factors/words)) (get-matches num (cdr factors/words)))\n\t\t\t(get-matches num (cdr factors/words)))))",
        "num":" ","output":[],"result":""
      },
      {
        "ast":"",
        "error":"",
        "input":"(define (gen-fizzbuzz lower upper factors/words)\n\t(if (> lower upper)\n\t\t'()\n\t\t(let ([out (get-matches lower factors/words)])\n\t\t\t(if (null? out)\n\t\t\t\t(display lower)\n\t\t\t\t(display out))\n\t\t\t(gen-fizzbuzz (+ 1 lower) upper factors/words))))",
        "num":" ","output":[],"result":""
      },
      {
        "ast":"",
        "error":"",
        "input":"(get-matches 12 '((3 \"Fizz\")\n\t\t\t\t  (5 \"Buzz\")\n\t\t\t\t  (4 \"Baaam\")))",
        "num":" ","output":[],"result":""
      },
      {
        "ast":"",
        "error":"",
        "input":"(gen-fizzbuzz 1 21 '((3 \"Fizz\")\n                     (5 \"Buzz\")\n                     (7 \"Baxx\")))",
        "num":" ","output":[],"result":""
      }],
    "fileName":"gen_fizzbuzz","fileType":"sch","id":"","isSaved":false,"totalNumber":0,"wholeProgTxt":""
  },
  BFBv1Id: {
    "cells":[
      {
        "ast":"","error":"",
        "input":"(define (fizzbuzz n c)\n\t(let ([out '()])\n\t\t(if (equal? 0 (modulo c 5))\n\t\t\t(set! out (cons \"buzz\" out))\n\t\t\t'())\n\t\t(if (equal? 0 (modulo c 3))\n\t\t\t(set! out (cons \"fizz\" out))\n\t\t\t'())\n\t\t(if (> (length out) 0)\n\t\t\t(display out)\n\t\t\t(display c)))\n\t\t(if (< (+ c ) n)\n\t\t\t(fizzbuzz n (+ c 1))\n\t\t\t'()))",
        "num":" ","output":[],"result":""
      },
      {"ast":"","error":"",
      "input":"(fizzbuzz 30 1)",
      "num":" ","output":[],"result":""
      }],
    "fileName":"fizzbuzz_v1","fileType":"sch","id":"","isSaved":false,"totalNumber":0,"wholeProgTxt":""
  },
  BFBv2Id: {
    "cells":[
      {
        "ast":"","error":"",
        "input":"(define (fizzbuzz x y)\n  (display\n    (cond (( = (modulo x 15) 0 ) \"FizzBuzz\")\n          (( = (modulo x 3) 0 ) \"Fizz\")\n          (( = (modulo x 5) 0 ) \"Buzz\")\n          (else x)))\n    (if (< x y) (fizzbuzz (+ x 1) y) '()))",
        "num":" ","output":[],"result":""
      },
      {
        "ast":"","error":"",
        "input":"(fizzbuzz 1 100)",
        "num":" ","output":[],"result":""
      }],
    "fileName":"fizzbuzz_v2","fileType":"sch","id":"","isSaved":false,"totalNumber":0,"wholeProgTxt":""
  },
  BFBv3Id: {
    "cells":[
      {
        "ast":"","error":"",
        "input":"(define (fizzbuzz lower upper)\n (cond\n\t((< upper lower) '())\n    ((and (equal? (modulo lower 3) 0) (equal? (modulo lower 5) 0))\n    \t(display \"fizzbuzz\") (fizzbuzz (+ lower 1) upper))\n\t((equal? (modulo lower 3) 0) (display \"fizz\") (fizzbuzz (+ lower 1) upper))\n\t((equal? (modulo lower 5) 0) (display \"buzz\") (fizzbuzz (+ lower 1) upper))\n\t(else (display lower) (fizzbuzz (+ lower 1) upper))))",
        "num":" ","output":[],"result":""
      },
      {
        "ast":"","error":"",
        "input":"(fizzbuzz 1 15)",
        "num":" ","output":[],"result":""
      }],
    "fileName":"fizzbuzz_v3","fileType":"sch","id":"","isSaved":false,"totalNumber":0,"wholeProgTxt":""
  }
};

const sectionArray = [
  {
    sectionTitle: "FizzBuzz",
    examples: [
      {
        eTitle: "Basic FizzBuzz v1",
        eId: "BFBv1Id"
      },
      {
        eTitle: "Basic FizzBuzz v2",
        eId: "BFBv2Id"
      },
      {
        eTitle: "Basic FizzBuzz v3",
        eId: "BFBv3Id"
      },
      {
        eTitle: "General FizzBuzz",
        eId: "GenFBId"
      },
    ]
  }
];

export {exampleFiles, sectionArray};