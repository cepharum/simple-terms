# We've moved!

This project is now maintained in [another repository](https://gitlab.com/cepharum-foss/simple-terms).

# Simple Terms

This package provides a simple terms processor suitable for reading hierarchical data structures and deriving new information from that. It is designed to support customized processing of data without exposing a full Javascript engine or and intentionally excludes support for code to adjust any provided data. 

For example, in our [forms processor](https://www.npmjs.com/package/forms-processor) this package is used to describe dependencies between fields e.g. making one field's visibility depending on having provided particular value on another one or initialize one value with the input of two other fields e.g. by combining first and last name of a person into full name of an account's holder using a term like `personal.lastName + ", " + personal.firstName`.

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
