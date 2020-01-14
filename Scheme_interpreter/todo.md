[Complete scheme grammar](https://www.scheme.com/tspl2d/grammar.html)

- [x] line comments
  - if it finds ; everything else on the line (that means until the next \n) is ignored
- [ ] better block (paren) handling and missing detection

### Data

- [ ] lists
- [ ] strings
- [ ] characters
- [ ] vectors ?
- [ ] #t and #f

### Expressions

- [x] if statements
- [x] change basic math and logic operators to accept more than two args
- [ ] cond - ? maybe. don't know yet
- [x] lambda
  - [x] named
  - [x] anonymous
    - nvm, it works without any more work. because we return a function and then apply some args to it. so it is the same as (+ 2 2), only the '+' (the function) is first evaluated and constructedmarked
  - [x] define named functions without lambda
    - (define (test x y z) (+ (x (- y z))))
- [ ] quoted object evaluates to itself

#### Syntax structures

- [ ] do block?
- [ ] set!
- [ ] let
- [ ] let\*
  - defined variables are accessible to other variables we are defining
