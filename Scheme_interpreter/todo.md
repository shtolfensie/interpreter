[Complete scheme grammar](https://www.scheme.com/tspl2d/grammar.html)

- [x] line comments
  - if it finds ; everything else on the line (that means until the next \n) is ignored
- [ ] better block (paren) handling and missing detection
- [ ] ? maybe give eval() the arg of from what keyword it is comming? like if we are evaling something after 'define', eval will know it
- [ ] create an error function
- [ ] evaluate a program composed of multiple S-expressions without the need for a begin
- [x] repl
- [ ] support bracket [] syntax in let and cond for ex

### Data

- [x] lists
- [ ] strings
  - [ ] don't remove whitespace from strings
- [ ] characters
- [ ] vectors ?
- [x] #t and #f

### Expressions

- [x] if statements
- [x] change basic math and logic operators to accept more than two args
- [ ] cond - ? maybe. don't know yet
- [ ] lambda
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
- [ ] quoted object evaluates to itself

#### Syntax structures

- [ ] do block?
- [x] set!
- [ ] let
- [ ] let\*
  - defined variables are accessible to other variables we are defining
