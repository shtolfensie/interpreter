- [x] line comments

- if it finds ; everything else on the line (that means until the next \n) is ignored

- [ ] lists

- [x] if statements

- [ ] cond - ? maybe. don't know yet

- [ ] lambda
  - [x] named
  - [x] anonymous
    - nvm, it works without any more work. because we return a function and then apply some args to it. so it is the same as (+ 2 2), only the '+' (the function) is first evaluated and constructedmarked 
  - [ ] define named functions without lambda
    - (define (test x y z) (+ (x (- y z))))

- [ ] quoted object evaluate to itself
