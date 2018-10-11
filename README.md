# Simple Terms

## Install

```bash
npm install simple-terms
```

## Usage

```javascript
import { Compiler } from "simple-terms";

console.log( new Compiler( "a + 5 > 10" ).evaluate( { 
    a: 6,
} ) );
```

This example will log the result of evaluating provided term with provided variable space applied which is `true`.

The provided term is compiled to Javascript function for improved evaluation. Nevertheless the term gets properly parsed by custom code limiting possibilities of code in term implicitly improving security this way.
