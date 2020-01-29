[Complete scheme grammar](https://www.scheme.com/tspl2d/grammar.html)

- [x] line comments
  - if it finds ; everything else on the line (that means until the next \n) is ignored
- [x] better block (paren) handling and missing detection
- [ ] ? maybe give eval() the arg of from what keyword it is comming? like if we are evaling something after 'define', eval will know it
- [ ] create an error function
  - [x] first version
  - [ ] create syntax check functions for all expressions that need it (not string, num, ...)
    - [ ] call each check func after matching a keyword in eval
    - [ ] create require function: gets a requirement, error msg, if req not met, throw error msg
- [x] evaluate a program composed of multiple S-expressions without the need for a begin
  - [x] separated by \n
  - [x] separated by " "
- [x] repl
- [x] new parser
  - [x] support bracket [] syntax in let and cond for ex
  - [x] dont break the string based on spaces, use a regex to get the front most token, eval it and work on the rest
- [x] toSchemeDisplayString
  - [x] display quasiquote symbols instead of the word
  - [x] display a quote if ast is a quoted obj (everything that is not a number, string, char, vector?, procedure)

### Data

- [x] lists
- [x] strings
  - [x] don't remove whitespace from strings
  - [x] include escaped quotes and support multiline strings and escaped backslashes
  - [ ] make-string k [char] : (make-string 10 #\x) => "xxxxxxxxxx"
  - [ ] string char...
  - [ ] list->string; string->list
  - [ ] string?
  - [ ] string-length
  - [ ] string-null? : (string-null? "") => #t
  - [ ] string-ref string k : (string-ref "Hello" 1) => #\e
  - [ ] string-set! string k char : (string-set! "Dog" 0 #\L) => "Log"
  - [ ] string=?; string-ci=?; string<?; string>?; string<=?; string>=?; string-ci<?; stirng-ci>?; string-ci<=?; string-ci>=?;
- [x] characters
  - [ ] allow for #\space to mean " "

- [x] #t and #f

### Expressions

- [x] if statements
- [x] change basic math and logic operators to accept more than two args
- [ ] cond
- [ ] lambda
  - [ ] can have multiple body expressions (lambda (x) body body ...) - evaluated like (begin body ...)
  - [x] named
  - [x] anonymous
    - nvm, it works without any more work. because we return a function and then apply some args to it. so it is the same as (+ 2 2), only the '+' (the function) is first evaluated and constructedmarked
  - [x] define named functions without lambda
    - (define (test x y z) (+ (x (- y z))))
  - [ ] add 'rest-args' possibility to functiono definition
    - `(define id (lambda (arg ... . rest-id) body ...+))`
    ```scheme
      (define (avg . l)
         (/ (apply + l) (length l)))
    
    > (avg 1 2 3)
    2
    ``` 
- [x] quoted object evaluates to itself
- [ ] quasiquote syntax
  - [x] nested quasiqoute and unqoute with nesting levels
  - [ ] unqoute-splicing

#### Syntax structures

- [x] set!
- [x] let
- [x] let\*
  - defined variables are accessible to other variables we are defining
- [ ] letrec
  - [ ] all avriables are defined at the 'same time', allowing for mutually recursive definitions
