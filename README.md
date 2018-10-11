# Simple Terms

## Install

```bash
npm install simple-terms
```

## Usage

```javascript
import { Compiler } from "simple-terms";

const compiler = new Compiler( "Sqr( outer.inner + 5 ) > 100" );
const result = compiler.evaluate( { 
    outer: {
    	inner: 6
    },
}, {
	sqr: value => value * value,
} );

console.log( result );
```

This example will log `true` for being the result of evaluating provided term in context of provided data (in 1st argument to `Compiler#evaluate()`) and functions (in 2nd argument to `Compiler#evaluate()`).

The provided term is compiled to Javascript function for evaluation with improved performance as well as security. This is achieved by parsing the term with custom code limiting possibilities of code in term. Terms may consist of

* unary and binary logical and arithmetic expressions
* reading access on a defined set of variables including addressing of object properties using dot notation
* invocations of a function in a defined set of functions (not: methods of objects).

To conclude, any term 

* may access provided data for reading,
* may invoke provided functions and
* is expected to deliver single result.
