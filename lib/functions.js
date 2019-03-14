/**
 * (c) 2018 cepharum GmbH, Berlin, http://cepharum.de
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 cepharum GmbH
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * @author: cepharum
 */

/**
 * Detects if any provided argument is set (neither `undefined` nor `null`).
 *
 * @param {*} args one of several arguments
 * @returns {boolean} true if at least one provided argument is neither `undefined` nor `null`
 */
export function isset( ...args ) { return args.some( i => i != null ); }

/**
 * Detects if every provided argument is unset (either `undefined` nor `null`)
 * or empty.
 *
 * @param {*} args one of several arguments
 * @returns {boolean} true if at all provided arguments are either `undefined`, `null` or some empty string
 */
export function empty( ...args ) { return !args.length || args.every( i => i == null || String( i ).length === 0 ); }

/**
 * Casts provided arbitrary value to boolean value.
 *
 * @param {*} input arbitrary input value
 * @returns {boolean} boolean value represented by provided value
 */
export function boolean( input = null ) { return Boolean( input ); }

/**
 * Casts provided arbitrary value to integer value.
 *
 * @param {*} input arbitrary input value
 * @returns {int} integer value represented by provided value
 */
export function integer( input ) { return parseInt( input ); }

/**
 * Casts provided arbitrary value to floating point number.
 *
 * @param {*} input arbitrary input value
 * @returns {float} floating point number represented by provided value
 */
export function number( input ) { return parseFloat( input ); }

/**
 * Casts provided arbitrary value to string.
 *
 * @param {*} input arbitrary input value
 * @returns {string} string representation of provided value
 */
export function string( input ) { return input == null ? "" : String( input ); }

/**
 * Removes all leading and trailing whitespace from string representation of
 * provided value.
 *
 * @param {*} input arbitrary input value
 * @returns {string} string representation of provided value w/ leading and trailing whitespace removed
 */
export function trim( input ) { return input == null ? "" : String( input ).trim(); }

/**
 * Repeatedly prepends padding string to some provided input string until
 * reaching desired length of resulting string.
 *
 * @param {string} input string to be padded
 * @param {int} finalLength requested length of resulting string
 * @param {string} padding string repeatedly prepended to provided string for padding
 * @return {string} padded string
 */
export function leftpad( input, finalLength, padding = " " ) {
	if ( input == null ) {
		return "";
	}

	const s = String( input );

	return String( padding ).repeat( Math.max( 0, finalLength - s.length ) ) + s;
}

/**
 * Repeatedly appends padding string to some provided input string until
 * reaching desired length of resulting string.
 *
 * @param {string} input string to be padded
 * @param {int} finalLength requested length of resulting string
 * @param {string} padding string repeatedly appended to provided string for padding
 * @return {string} padded string
 */
export function rightpad( input, finalLength, padding = " " ) {
	if ( input == null ) {
		return "";
	}

	const s = String( input );

	return s + String( padding ).repeat( Math.max( 0, finalLength - s.length ) );
}

/**
 * Repeatedly appends padding string to some provided input string until
 * reaching desired length of resulting string.
 *
 * @param {string} input string to be padded
 * @param {int} finalLength requested length of resulting string
 * @param {string} padding string repeatedly appended to provided string for padding
 * @return {string} padded string
 */
export function centerpad( input, finalLength, padding = " " ) {
	if ( input == null ) {
		return "";
	}

	let s = String( input );
	let right = true;

	while ( s.length < finalLength ) {
		s = right ? s + padding : padding + s;
		right = !right;
	}

	return s;
}

/**
 * Removes all leading and trailing whitespace from string representation of
 * provided value and replaces inner sequences of whitespace w/ single SPC
 * characters.
 *
 * @param {*} input arbitrary input value
 * @returns {string} string representation of provided value w/ leading and trailing whitespace removed
 */
export function normalize( input ) { return input == null ? "" : String( input ).trim().replace( /\s+/g, " " ); }

/**
 * Converts all uppercase characters in provided string to lowercase characters.
 *
 * @param {string} input string probably containing uppercase characters
 * @returns {string} provided string with uppercase characters replaced by lowercase variants
 */
export function lowercase( input ) {
	return input == null ? null : String( input ).toLocaleLowerCase();
}

/**
 * Converts all lowercase characters in provided string to uppercase characters.
 *
 * @param {string} input string probably containing lowercase characters
 * @returns {string} provided string with lowercase characters replaced by uppercase variants
 */
export function uppercase( input ) {
	return input == null ? null : String( input ).toLocaleUpperCase();
}

/**
 * Rounds provide value to selected precision.
 *
 * This function is implementing mercantile rounding when it comes to negative
 * values, thus it's differing from native Math.round() of Javascript by always
 * rounding _away from zero_.
 *
 * @param {*} input arbitrary input value
 * @param {int} precision precision of result value in digits succeeding decimal separator
 * @returns {number} rounded value
 */
export function round( input, precision = 0 ) {
	const _input = parseFloat( input );
	if ( isNaN( _input ) ) {
		return NaN;
	}

	const _precision = precision >= 0 ? Math.floor( precision ) : Math.ceil( precision );
	const _value = _input * Math.pow( 10, _precision );

	return ( _value < 0 ? -Math.round( -_value ) : Math.round( _value ) ) / Math.pow( 10, _precision );
}

/**
 * Retrieves pseudo-random integer value in selected range.
 *
 * @param {int} min lower inclusive boundary of range
 * @param {int} max upper exclusive boundary of range
 * @return {int} random value
 */
export function random( min = 0, max = Infinity ) {
	return Math.floor( ( Math.random() * ( max - min ) ) + min );
}

/**
 * Returns sum of a set of numeric values.
 *
 * @param {number[]} values list of values
 * @returns {number} sum of all provided numeric arguments, NaN on providing anything but an array
 */
export function sum( values ) {
	if ( !Array.isArray( values ) ) {
		return NaN;
	}

	const numValues = values.length;
	let _sum = 0;

	for ( let i = 0; i < numValues; i++ ) {
		const numeric = parseFloat( values[i] );
		if ( !isNaN( numeric ) ) {
			_sum += numeric;
		}
	}

	return _sum;
}

/**
 * Returns count of numeric values in a set of values.
 *
 * @param {number} values list of arguments
 * @returns {number} number of numeric arguments, NaN on providing anything but an array
 */
export function count( values ) {
	if ( !Array.isArray( values ) ) {
		return NaN;
	}

	const numValues = values.length;
	let _count = 0;

	for ( let i = 0; i < numValues; i++ ) {
		if ( !isNaN( parseFloat( values[i] ) ) ) {
			_count++;
		}
	}

	return _count;
}

/**
 * Returns average of all numeric arguments.
 *
 * @param {number} values list of values
 * @returns {number} average value, NaN on providing empty array or anything but an array
 */
export function average( values ) {
	if ( !Array.isArray( values ) ) {
		return NaN;
	}

	const { num, _sum } = values.reduce( ( ctx, i ) => {
		const numeric = parseFloat( i );

		if ( !isNaN( numeric ) ) {
			ctx.num++;
			ctx._sum += numeric;
		}

		return ctx;
	}, { num: 0, _sum: 0 } );

	return _sum / num;
}

/**
 * Returns median value of all numeric values in a set of values.
 *
 * @param {number} values list of values
 * @returns {number} average value of arguments
 */
export function median( values ) {
	if ( !Array.isArray( values ) ) {
		return NaN;
	}

	const size = values.length;
	const _values = new Array( size );
	let write = 0;

	for ( let read = 0; read < size; read++ ) {
		const numeric = parseFloat( values[read] );
		if ( !isNaN( numeric ) ) {
			_values[write++] = numeric;
		}
	}

	_values.splice( write, size );
	_values.sort();

	if ( write % 2 === 1 ) {
		return _values[Math.floor( write / 2 )];
	}

	write = write / 2;

	const a = _values[write - 1];
	const b = _values[write];

	return ( a + b ) / 2;
}

/**
 * Creates array by concatenating all provided arrays inserting any non-array
 * data.
 *
 * @param {*} args arbitrary data
 * @returns {array} concatenation of all arguments
 */
export function concat( ...args ) { return [].concat( ...args ); }

/**
 * Fetches number of elements in an array or number of characters in a
 * string.
 *
 * @param {string|Array} data array or string to be inspected
 * @returns {int} number of elements in array or number of characters in string, NaN on providing neither kind of data
 */
export function length( data ) {
	switch ( typeof data ) {
		case "object" :
			if ( !Array.isArray( data ) ) {
				break;
			}

			// falls through
		case "string" :
			return data.length;
	}

	return NaN;
}

/**
 * Finds item matching provided string or regular expression.
 *
 * @param {Array} haystack set of strings to be searched
 * @param {string} needle string to search or some regular expression for testing on either element for match
 * @param {boolean} regexp set true if `needle` is containing regular expression
 * @returns {int} index of item matching `needle`, -1 if missing
 */
export function indexof( haystack, needle, regexp = false ) {
	if ( Array.isArray( haystack ) ) {
		let _needle;

		if ( regexp ) {
			const match = /^\s*\/(.+)\/([miguy]+)?\s*$/.exec( needle );
			if ( match ) {
				_needle = new RegExp( match[1], match[2] );
			} else {
				_needle = new RegExp( needle == null ? needle : String( needle ) );
			}
		} else {
			_needle = needle == null ? "" : String( needle );
		}

		const numItems = haystack.length;
		for ( let i = 0; i < numItems; i++ ) {
			const _item = haystack[i];

			if ( regexp ) {
				if ( _needle.test( _item ) ) {
					return i;
				}
			} else if ( ( _item == null ? "" : String( _item ) ) === _needle ) {
				return i;
			}
		}
	}

	return -1;
}

/**
 * Fetches element of array selected by its zero-based index.
 *
 * @param {Array} items set of items
 * @param {int} index zero-based index of item to fetch
 * @param {*} fallbackIfMissing value to return if selected item does not exist
 * @returns {*} selected item of array, provided fallback or `null` if item is missing
 */
export function item( items, index, fallbackIfMissing = null ) {
	return Array.isArray( items ) && index > -1 && index < items.length ? items[Math.floor( index )] : fallbackIfMissing;
}

/**
 * Retrieves array containing all provided arguments.
 *
 * @param {*} args set of provided arguments
 * @returns {*[]} provided set of arguments as array
 */
export function array( ...args ) { return args; }

/**
 * Removes all falsy elements in provided array.
 *
 * @param {*[]} items lists elements to be filtered
 * @returns {*[]} provided list of elements with falsy elements removed
 */
export function filter( items ) { return Array.isArray( items ) ? items.filter( i => i ) : items ? [items] : []; }

/**
 * Joins all elements of provided array into single string using provided glue
 * put between elements in resulting string.
 *
 * @param {*[]} items lists elements to be joined
 * @param {string} glue string inserted between all elements in resulting string
 * @returns {string} concatenation of elements in provided list
 */
export function join( items, glue = "" ) { return Array.isArray( items ) ? items.join( glue == null ? "" : String( glue ) ) : items ? String( items ) : ""; }

/**
 * Splits provided string into list of elements considering provided separator
 * used in string between either element.
 *
 * @param {string} input string containing elements separated by separator
 * @param {string} separator string used to separate elements in provided input
 * @param {boolean} regexp set true if `separator` is source of a regular expression
 * @returns {string[]} set of elements
 */
export function split( input, separator = "", regexp = false ) {
	let _separator;

	if ( regexp ) {
		const match = /^\s*\/(.+)\/([miguy]+)?\s*$/.exec( separator );
		if ( match ) {
			_separator = new RegExp( match[1], match[2] );
		} else {
			_separator = new RegExp( separator == null ? separator : String( separator ) );
		}
	} else {
		_separator = separator == null ? "" : String( separator );
	}

	return ( input == null ? "" : String( input ) ).split( _separator );
}

/**
 * Tests first argument for being truthy to return second argument in that case
 * and third argument in any other case.
 *
 * @param {boolean} condition boolean value controlling whether returning second or third argument
 * @param {*} trueCase data returned if `condition` is truthy
 * @param {*} falseCase data returned if `condition` is falsy
 * @returns {*} either value of `trueCase` or `falseCase`
 */
export function test( condition, trueCase, falseCase = null ) {
	return condition ? trueCase : falseCase;
}

/**
 * Retrieves first provided argument with non-null value.
 *
 * @param {...*} args arbitrary arguments
 * @returns {*} value of first non-null argument, null on provide no argument or only null-arguments
 */
export function first( ...args ) {
	const numArgs = args.length;

	for ( let i = 0; i < numArgs; i++ ) {
		const arg = args[i];

		if ( arg != null ) {
			return arg;
		}
	}

	return null;
}

/**
 * Reads named cookie or tests if named cookie exists.
 *
 * @param {string} name name of cookie to read
 * @param {boolean} testExistence set true to check if named cookie exists instead of actually reading it
 * @return {boolean|*} true/false on testing if some cookie exists, found cookie's value or null otherwise
 */
export function cookie( name, testExistence = false ) {
	if ( typeof document !== "undefined" && /^[a-zA-Z0-9_]+$/.test( name ) ) {
		const match = new RegExp( "(?:^|;)\\s*" + name + "\\s*=\\s*([^;\\s]+)" ).exec( document.cookie ); // eslint-disable-line no-undef
		if ( match ) {
			return testExistence ? true : match[1];
		}
	}

	return testExistence ? false : null;
}

/**
 * Retrieves description of current date/time.
 *
 * @param {boolean} utc set true to get all information in UTC rather than some currently selected timezone
 * @return {{year:int, month:int, day:int, hour:int, minute:int, second:int, dow:int}} description of current date/time
 */
export function now( utc = false ) {
	const ts = new Date();

	return {
		year: utc ? ts.getUTCFullYear() : ts.getFullYear(),
		month: ( utc ? ts.getUTCMonth() : ts.getMonth() ) + 1,
		day: utc ? ts.getUTCDate() : ts.getDate(),
		dow: utc ? ts.getUTCDay() : ts.getDay(),
		hour: utc ? ts.getUTCHours() : ts.getHours(),
		minute: utc ? ts.getUTCMinutes() : ts.getMinutes(),
		second: utc ? ts.getUTCSeconds() : ts.getSeconds(),
	};
}

/**
 * Retrieves formatted date/time descriptor.
 *
 * @param {string} format describes format of resulting string
 * @param {{year:int, month:int, day:int, hour:int, minute:int, second:int, dow:int}} timestamp time to use instead of current time
 * @returns {string} formatted representation of provided or current time
 */
export function datetime( format, timestamp = null ) {
	const time = timestamp || now();

	const numChars = format.length;
	const result = new Array( numChars );
	let escape = false;

	for ( let i = 0; i < numChars; i++ ) {
		const char = format[i];

		if ( escape ) {
			escape = false;
			result[i] = char;
			continue;
		}

		switch ( char ) {
			// date with padding
			case "D" :
			case "d" : result[i] = String( "0" + ( time.day || 0 ) ).slice( -2 ); break;
			case "M" :
			case "m" : result[i] = String( "0" + ( time.month || 0 ) ).slice( -2 ); break;
			case "Y" :
			case "y" : result[i] = String( "000" + ( time.year || 0 ) ).slice( -4 ); break;

			// date without padding
			case "J" :
			case "j" : result[i] = time.day || 0; break;
			case "N" :
			case "n" : result[i] = time.month || 0; break;

			// time with padding
			case "H" :
			case "h" : result[i] = String( "0" + ( time.hour || 0 ) ).slice( -2 ); break;
			case "I" :
			case "i" : result[i] = String( "0" + ( time.minute || 0 ) ).slice( -2 ); break;
			case "S" :
			case "s" : result[i] = String( "0" + ( time.second || 0 ) ).slice( -2 ); break;

			// time without padding
			case "G" :
			case "g" : result[i] = ( time.hour || 0 ); break;

			case "\\" :
				escape = true;
				result[i] = "";
				break;

			default :
				result[i] = char;
		}
	}

	return result.join( "" );
}
