const exampleFilesJsl = {
  vars: {"fileName":"Variables_example","cells":[{"num":" ","input":"var test;\nreturn test;","output":[],"result":"","error":"","ast":""},{"num":" ","input":"test = 3;\nreturn test;","output":[],"result":"","error":"","ast":""},{"num":" ","input":"var num = 87;\nreturn num;","output":[],"result":"","error":"","ast":""},{"num":" ","input":"var num2 = num + 2 * 4;\nreturn num2;","output":[],"result":"","error":"","ast":""}],"totalNumber":0,"wholeProgTxt":"var num = 87;","id":"IVs3lG83DTpMtgrg2Z3x","fileType":"jsl","isSaved":false
  },
  func: {"fileName":"Function_example","cells":[{"num":" ","input":"var inc5 = fun (a) => {\n\treturn a + 5;\n};\ninc5(2);","output":[],"result":"","error":"","ast":""}],"totalNumber":0,"wholeProgTxt":"","fileType":"jsl","isSaved":false,"id":"PhhMB2O7Fio0cpfL66SY"
  },
  fac1: {"fileName":"Factorial1","cells":[{"num":" ","input":"var res = 0;\nvar fac = fun (n) => {\n\tif (n > 1) {\n\t\tfac(n-1);\n\t\tres = res * n;\n\t} else {\n\t\tres = 1;\n\t};\n};\nfac(5);\nreturn res;","output":[],"result":"","error":"","ast":""},{"num":" ","input":"","output":[],"result":"","error":"","ast":""}],"totalNumber":0,"wholeProgTxt":"","fileType":"jsl","isSaved":false,"id":"aJ9EEmMin2eIadhH41ao"
  },
  fac2: {"fileName":"Factorial2","cells":[{"num":" ","input":"var fac = fun (n) => {\n\tif (n == 1) {\n\t\treturn 1;\n\t};\n\treturn n * fac(n-1);\n};\n\nfac(5);","output":[],"result":"","error":"","ast":""},{"num":" ","input":"fac(3);","output":[],"result":"","error":"","ast":""}],"totalNumber":0,"wholeProgTxt":"","fileType":"jsl","isSaved":false,"id":"ZPsJElHtkMVjcqe6Rqn9"
  },
  fib1: {"fileName":"Fibonacci","cells":[{"num":" ","input":"var res = 0;\nvar fib = fun (n) => {\n\tif (n == 1){\n\t\tres = 1;\n\t} else if (n == 2) {\n\t\tres = 1;\n\t} else {\n\t\tfib(n-1);\n\t\tvar temp = res;\n\t\tfib(n-2);\n\t\tres = temp + res;\n\t};\n};\nfib(19);\nreturn res;","output":[],"result":"","error":"","ast":""}],"totalNumber":0,"wholeProgTxt":"","fileType":"jsl","isSaved":false,"id":"QiRxyvi1iYwE878UpIyO"
  },
};

const sectionArrayJsl = [
  {
    sectionTitle: 'Creating variables',
    examples: [
      {
        eTitle: 'Using the var keyword',
        eId: 'vars'
      }
    ]
  },
  {
    sectionTitle: 'Creating and calling functions',
    examples: [
      {
        eTitle: 'Functions',
        eId: 'func'
      }
    ]
  },
  {
    sectionTitle: "Example algorithms",
    examples: [
      {
        eTitle: "Factorial 1",
        eId: "fac1"
      },
      {
        eTitle: "Factorial 2",
        eId: "fac2"
      },
      {
        eTitle: "Fibonacci 1",
        eId: "fib1"
      }
    ]
  },
];

export {exampleFilesJsl, sectionArrayJsl};