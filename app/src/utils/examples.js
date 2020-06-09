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
        "input":"(define (gen-fizzbuzz lower upper factors/words)\n\t(if (> lower upper)\n\t\t'()\n\t\t(let ([out (get-matches lower factors/words)])\n\t\t\t(if (null? out)\n\t\t\t\t(display lower)\n\t\t\t\t(display out))\n\t\t\t(newline)\n\t\t\t(gen-fizzbuzz (+ 1 lower) upper factors/words))))",
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
  },
  defId: {
    "fileName":"Define_example",
    "cells":[
      {
        "num":" ","input":"undeclared","output":[],"result":"","error":"","ast":""
      },
      {
        "num":" ",
        "input":"(define unassigned)\nunassigned","output":[],"result":"","error":"","ast":""
      },
      {
        "num":" ","input":"(define x 10)\nx","output":[],"result":"","error":"","ast":""
      },
      {
        "num":" ","input":"(define two-plus-two (+ 2 2))\ntwo-plus-two","output":[],"result":"","error":"","ast":""
      },
      {
        "num":" ",
        "input":"; procedure declaration shorthand. see 'lambda' example for more info\n(define (func y)\n\t(if (= y 0)\n\t\t\"Zero\"\n\t\t(+ y y)))\n\n; procedure application - passes the return value to another function\n(write-line (func 5))\n\n; procedure application - returns the value\n(func 0)",
        "output":[],"result":"","error":"","ast":""
      }],
      "totalNumber":0,"wholeProgTxt":"","fileType":"sch","isSaved":false,"id":"mhBXEcLCsCwB7tvWvvml"
  },
  setId: {"fileName":"Set_example","cells":[{"num":" ","input":"; variables shouldn't be mutated.\n; But if they need to be, you can use 'set!'\n(define x 10)\n(write-line x)\n\n(set! x 25)\n(write-line x)","output":[],"result":"","error":"","ast":""},{"num":" ","input":"; set doesn't create a variable\n(set! y 5) ; <-- error","output":[],"result":"","error":"","ast":""}],"totalNumber":0,"wholeProgTxt":"","fileType":"sch","isSaved":false,"id":"dvzgbr6H43rgVGw59GWv"
  },
  lamId: {"fileName":"Lambda_example","cells":[{"num":" ","input":"; basic procedure creation\n\n(lambda (x) \n\t(* x x))\n; this procedure isn't stored or called anywhere. It only returns itself","output":[],"result":"","error":"","ast":""},{"num":" ","input":"; calling an anonymous procedure\n; wrap it like any other, and give it an argument if needed\n((lambda (x)\n\t(* x x)) 5)","output":[],"result":"","error":"","ast":""},{"num":" ","input":"; to store it in a variable, use 'define'\n\n(define squared (lambda (x)\n\t(* x x)))\n\n(squared 3)","output":[],"result":"","error":"","ast":""},{"num":" ","input":"; you can also use the shorthand syntax. see 'define' example for more info\n(define (func x) (+ x 2))\n\n(func 4)","output":[],"result":"","error":"","ast":""},{"num":" ","input":"; a procedure can have an unlimited number of arguments\n; to capture all the arguments, use the '.' (dot) operator\n\n(define (ABorMore a b . more) ; more will be a list of all other args\n\t(if (and (list? more) (not (null? more)))\n\t\t(apply + more)\n\t\t(+ a b)))","output":[],"result":"","error":"","ast":""},{"num":" ","input":"(ABorMore 1 2)","output":[],"result":"","error":"","ast":""},{"num":" ","input":"(ABorMore 1 2 3 5) ; 3+5","output":[],"result":"","error":"","ast":""},{"num":" ","input":"(ABorMore 1 2 3 4 5 6 7 8) ; 3+4+5+...","output":[],"result":"","error":"","ast":""}],"totalNumber":0,"wholeProgTxt":"","fileType":"sch","isSaved":false,"id":"wjOmqQCvPYrueVnjIZ2u"
  },
  BMFid: {"fileName":"Math_example","cells":[{"num":" ","input":"(+ 5 5)\n","output":[],"result":"","error":"","ast":""},{"num":" ","input":"(+ 2.0 5)","output":[],"result":"","error":"","ast":""},{"num":" ","input":"(- 5.1 0.5)","output":[],"result":"","error":"","ast":""},{"num":" ","input":"(* 5 5)","output":[],"result":"","error":"","ast":""},{"num":" ","input":"(/ (- 10 2) 4)","output":[],"result":"","error":"","ast":""},{"num":" ","input":"(sin (/ PI 2))","output":[],"result":"","error":"","ast":""}],"totalNumber":0,"wholeProgTxt":"","fileType":"sch","isSaved":false,"id":"cXJzEsUPTsbUlDTDCTlW"
  },
  begId: {"fileName":"Begin_example","cells":[{"num":" ","input":"(begin ; begin can execute multiple expressions\n\t(display \"Hello\")\n\t((lambda (x) (* x x)) 2))","output":[],"result":"","error":"","ast":""},{"num":" ","input":"","output":[],"result":"","error":"","ast":""}],"totalNumber":0,"wholeProgTxt":"","fileType":"sch","isSaved":false,"id":"CyuecuQOAV8gcQW4XFbl"
  },
  letId: {"fileName":"Let_example","cells":[{"num":" ","input":"(let ([x 10] [y 6]) ; local variable definition\n\t(* x y)) ; body\n; x and y don't exist in the outer environment","output":[],"result":"","error":"","ast":""},{"num":" ","input":"(let loop ([i 0]) ; named let, can be used for loops\n\t(if (= i 10)\n\t\t(void)\n\t\t(begin\n\t\t\t(write-line (number->string i))\n\t\t\t(loop (+ i 1)))))","output":[],"result":"","error":"","ast":""}],"totalNumber":0,"wholeProgTxt":"","fileType":"sch","isSaved":false,"id":"6bCteahv0cKMBaFZA3RP"},
  strId: {"cells":[{"ast":"","error":"","input":"(define (s-upcase s)\n\t(list->string (map char-upcase (string->list s))))","num":" ","output":[],"result":""},{"ast":"","error":"","input":"(display (s-upcase \"ahoj jak je!\"))","num":" ","output":[],"result":""},{"ast":"","error":"","input":"(define (s-downcase s)\n\t(list->string (map char-downcase (string->list s))))","num":" ","output":[],"result":""},{"ast":"","error":"","input":"(s-downcase (s-upcase \"ahoj jak je!\"))","num":" ","output":[],"result":""},{"ast":"","error":"","input":"(char->name #\\A)","num":" ","output":[],"result":""},{"ast":"","error":"","input":"(name->char \"f\")","num":" ","output":[],"result":""},{"ast":"","error":"","input":"(char->name (char-upcase (name->char \"f\")))","num":" ","output":[],"result":""},{"ast":"","error":"","input":"(make-string 5 's)","num":" ","output":[],"result":""},{"ast":"","error":"","input":"(string #\\h #\\o #\\j)","num":" ","output":[],"result":""},{"ast":"","error":"","input":"(string-length \"ahoj\")","num":" ","output":[],"result":""},{"ast":"","error":"","input":"(string-ref \"123\" 1)","num":" ","output":[],"result":""},{"ast":"","error":"","input":"(substring \"ahoj\" 0 2)","num":" ","output":[],"result":""},{"ast":"","error":"","input":"(list->string (string->list \"how are you\"))","num":" ","output":[],"result":""},{"ast":"","error":"","input":"(define t 20)","num":" ","output":[],"result":""},{"ast":"","error":"","input":"(number->string t)","num":" ","output":[],"result":""},{"num":" ","input":"","output":[],"result":"","error":"","ast":""}],"fileName":"Strings_Example","fileType":"sch","id":"0cMiNT517pELMeTKuct9","isSaved":false,"totalNumber":0,"wholeProgTxt":""
  },

};

const sectionArray = [
  {
    sectionTitle: 'Basic syntax and keywords',
    examples: [
      {
        eTitle: 'define: defining variables and procedures',
        eId: 'defId'
      },
      {
        eTitle: 'set!: mutating variables',
        eId: 'setId'
      },
      {
        eTitle: 'lambda: creating procedures',
        eId: 'lamId',
      },
      {
        eTitle: 'Basic math functions',
        eId: 'BMFid'
      },
      {
        eTitle: 'begin',
        eId: 'begId'
      },
      {
        eTitle: 'let, let*: defining local variables',
        eId: 'letId'
      }
    ]
  },
  {
    sectionTitle: 'Strings and chars',
    examples: [
      {
        eTitle: 'Working with strings',
        eId: 'strId'
      }
    ]
  },
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
  },
];

export {exampleFiles, sectionArray};