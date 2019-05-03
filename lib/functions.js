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

const regexpFunctional = ".?+*{}()[]|\\";

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
 * @param {string} decimalSeparator assumed decimal separator
 * @param {string} thousandsSeparator assumed thousands separator
 * @returns {float} floating point number represented by provided value
 */
export function number( input, decimalSeparator = null, thousandsSeparator = null ) {
	if ( decimalSeparator == null && thousandsSeparator == null ) {
		return parseFloat( input );
	}

	let _th = "";
	let _dec = decimalSeparator == null ? thousandsSeparator.indexOf( "." ) > -1 ? "," : "." : decimalSeparator;

	if ( thousandsSeparator != null ) {
		const num = thousandsSeparator.length;
		let multi = false;

		for ( let i = 0; i < num; i++ ) {
			const ch = thousandsSeparator[i];
			if ( ch !== _dec ) {
				multi |= ( _th !== "" );
				_th += regexpFunctional.indexOf( ch ) < 0 ? ch : "\\" + ch;
			}
		}

		if ( multi ) {
			_th = `(?:${_th})`;
		}

		if ( _th !== "" ) {
			_th += "?";
		}
	}

	if ( regexpFunctional.indexOf( _dec ) > -1 ) {
		_dec = "\\" + _dec;
	}

	const match = new RegExp( `^\\s*([+-]?)(\\d{1,3}(?:${_th}\\d{3})*)(?:${_dec}(\\d+))?\\b` ).exec( input );
	if ( match ) {
		return parseFloat( `${match[1]}${match[2].replace( /\D/g, "" )}.${match[3]}`)
	}

	return NaN;
}

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
 * Rounds provided value to selected precision.
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
	const _scale = Math.pow( 10, _precision );
	const _value = _input * _scale;

	return ( _value < 0 ? -Math.round( -_value ) : Math.round( _value ) ) / _scale;
}

/**
 * Rounds up provided value to selected precision.
 *
 * This function is implementing mercantile rounding when it comes to negative
 * values, thus it's differing from native Math.round() of Javascript by always
 * rounding _away from zero_.
 *
 * @param {*} input arbitrary input value
 * @param {int} precision precision of result value in digits succeeding decimal separator
 * @returns {number} rounded value
 */
export function ceil( input, precision = 0 ) {
	const _input = parseFloat( input );
	if ( isNaN( _input ) ) {
		return NaN;
	}

	const _precision = precision >= 0 ? Math.floor( precision ) : Math.ceil( precision );
	const _scale = Math.pow( 10, _precision );
	const _value = _input * _scale;

	return ( _value < 0 ? -Math.ceil( -_value ) : Math.ceil( _value ) ) / _scale;
}

/**
 * Rounds down provided value to selected precision.
 *
 * This function is implementing mercantile rounding when it comes to negative
 * values, thus it's differing from native Math.round() of Javascript by always
 * rounding down _towards zero_.
 *
 * @param {*} input arbitrary input value
 * @param {int} precision precision of result value in digits succeeding decimal separator
 * @returns {number} rounded value
 */
export function floor( input, precision = 0 ) {
	const _input = parseFloat( input );
	if ( isNaN( _input ) ) {
		return NaN;
	}

	const _precision = precision >= 0 ? Math.floor( precision ) : Math.ceil( precision );
	const _scale = Math.pow( 10, _precision );
	const _value = _input * _scale;

	return ( _value < 0 ? -Math.floor( -_value ) : Math.floor( _value ) ) / _scale;
}

/**
 * Retrieves absolute amount of provided value thus converting negative numbers
 * into positive ones.
 *
 * @param {number} input arbitrary input value
 * @returns {number} absolute amount of value
 */
export function abs( input ) { return Math.abs( parseFloat( input ) ); }

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
 * @typedef {{year:int, month:int, day:int, hour:int, minute:int, second:int, dow:int}} DateTimeObject
 */

/**
 * Retrieves number of seconds since Unix Epoch of date/time described in first
 * argument.
 *
 * @param {null|string|Date} input value to be converted
 * @returns {number} number of seconds since Unix Epoch of provided date/time descriptor
 */
export function parsedate( input ) {
	let _input = input;

	switch ( typeof _input ) {
		case "number" :
			return _input;

		case "string" :
			if ( /^[+-]?\d+(?:\.\d+)?$/.test( input ) ) {
				return parseFloat( input );
			}

			_input = new Date( input );
			break;

		case "undefined" :
		case "object" :
			if ( !input ) {
				_input = new Date();
				break;
			}

			if ( input instanceof Date ) {
				_input = input;
				break;
			}

		// falls through
		default :
			return NaN;
	}

	if ( isNaN( _input ) ) {
		return NaN;
	}

	return isNaN( _input ) ? NaN : _input.getTime() / 1000;
}

/**
 * Describes provided date/time information using object with separate properties.
 *
 * @param {*} timestamp date/time information
 * @param {boolean} utc set true to get all information in UTC rather than some currently selected timezone
 * @return {DateTimeObject} separate elements of date/time information
 */
export function describedate( timestamp = null, utc = false ) {
	const _input = timestamp == null ? new Date() : new Date( parsedate( timestamp ) * 1000 );

	return {
		year: utc ? _input.getUTCFullYear() : _input.getFullYear(),
		month: ( utc ? _input.getUTCMonth() : _input.getMonth() ) + 1,
		day: utc ? _input.getUTCDate() : _input.getDate(),
		dow: utc ? _input.getUTCDay() : _input.getDay(),
		hour: utc ? _input.getUTCHours() : _input.getHours(),
		minute: utc ? _input.getUTCMinutes() : _input.getMinutes(),
		second: utc ? _input.getUTCSeconds() : _input.getSeconds(),
	};
}

/**
 * Retrieves formatted date/time descriptor.
 *
 * @param {string} format describes format of resulting string
 * @param {*} timestamp time to use instead of current time
 * @returns {string} formatted representation of provided or current time
 */
export function formatdate( format, timestamp = null ) {
	const seconds = parsedate( timestamp );
	if ( isNaN( seconds ) ) {
		return "NaN";
	}

	const time = new Date( seconds * 1000 );
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
			case "d" : result[i] = String( "0" + time.getDate() ).slice( -2 ); break;
			case "M" :
			case "m" : result[i] = String( "0" + ( time.getMonth() + 1 ) ).slice( -2 ); break;
			case "Y" :
			case "y" : result[i] = String( "000" + time.getFullYear() ).slice( -4 ); break;

			// date without padding
			case "J" :
			case "j" : result[i] = time.getDate(); break;
			case "N" :
			case "n" : result[i] = time.getMonth() + 1; break;

			// time with padding
			case "H" :
			case "h" : result[i] = String( "0" + time.getHours() ).slice( -2 ); break;
			case "I" :
			case "i" : result[i] = String( "0" + time.getMinutes() ).slice( -2 ); break;
			case "S" :
			case "s" : result[i] = String( "0" + time.getSeconds() ).slice( -2 ); break;

			// time without padding
			case "G" :
			case "g" : result[i] = time.getHours(); break;

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

/**
 * Retrieves description of current date/time.
 *
 * @param {boolean} utc set true to get information in UTC instead of local time
 * @return {number} number of seconds since Unix Epoch
 */
export function now( utc = false ) {
	const _now = new Date();

	return ( _now.getTime() / 1000 ) - ( utc ? _now.getTimezoneOffset() * 60 : 0 );
}

/**
 * Replaces time of day in provided timestamp to midnight.
 *
 * @param {*} timestamp date/time information to be adjusted
 * @return {number} number of seconds since Unix Epoch of midnight starting day in provided timestamp
 */
export function droptime( timestamp = null ) {
	const _time = parsedate( timestamp );
	if ( isNaN( _time ) ) {
		return _time;
	}

	const time = new Date( _time * 1000 );
	time.setHours( 0 );
	time.setMinutes( 0 );
	time.setSeconds( 0 );

	return Math.round( time.getTime() / 1000 );
}

/**
 * Lists normalized number of days per month used to get distance in (nonlinear)
 * years.
 *
 * @type {number[]} lists fixed lengths of months ignoring special days in February
 */
const nonlinearMonthLengths = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

/**
 * Provides factors addressing different accuracies per unit of resulting
 * distances.
 *
 * @type {object<string,int>} maps from name of a unit into factor used to round digits following decimal separator
 */
const distanceAccuracies = {
	s: 1,
	i: 100,
	h: 1000,
	d: 1000,
	w: 1000,
	m: 100,
	nm: 100,
	y: 1000,
	ny: 1000,
};

/**
 * Calculates distance of two provided date/time descriptors in selected unit.
 *
 * @note Differences in months rely on linearized time per month which is why
 *       2019-02-15 to 2019-03-15 isn't resulting in "1 month" but slightly less
 *       then "1 month" due to 2019-03-15 not being mid of March but 2019-02-15
 *       being mid of February. Handling of years works similar, so consider
 *       rounding results. Special units "nm" and "ny" are supported to perform
 *       non-linear calculations, though these aren't accurate in edge cases due
 *       to ignoring days of one timestamp's month that doesn't exist in the
 *       other timestamp's month.
 *
 * @param {*} timestamp first out of two date/time descriptors to be compared
 * @param {*} reference second out of two date/time descriptors to be compared
 * @param {string} unit unit of resulting distance, s for seconds, i for minutes, h for hours, d for days, w for weeks, m for months, y for years
 * @param {boolean} absolute set true to always get absolute distance between the two provided date/time descriptors
 * @returns {number} distance between given date/time descriptors
 */
export function datediff( timestamp, reference = null, unit = "s", absolute = false ) {
	const _distant = parsedate( timestamp );
	const _reference = parsedate( reference );

	if ( isNaN( _distant ) || isNaN( _reference ) ) {
		return NaN;
	}

	let diff = _distant - _reference;
	const sign = diff < 0 && absolute ? -1 : 1;
	const _unit = String( unit || "s" ).toLowerCase();
	let nonLinear = false, nonLinearYear = false;

	switch ( _unit ) {
		case "s" :
		default :
			return sign * diff;

		case "i" : return sign * ( diff / 60 );
		case "h" : return sign * ( diff / 3600 );
		case "d" : return sign * ( diff / 86400 );
		case "w" : return sign * ( diff / 86400 / 7 );
		case "ny" :
			nonLinearYear = true;
			// falls through
		case "nm" :
			nonLinear = true;
			// falls through
		case "y" :
		case "m" : {
			const dist = new Date( _distant * 1000 );
			const _ref = new Date( _reference * 1000 );

			// get number of days in either timestamp's month
			const dLOM = new Date( dist.getTime() );
			dLOM.setMonth( dLOM.getMonth() + 1 );
			dLOM.setDate( 0 );
			let dDaysOfMonth = nonLinearYear ? nonlinearMonthLengths[dLOM.getMonth()] : dLOM.getDate();

			const rLOM = new Date( _ref.getTime() );
			rLOM.setMonth( rLOM.getMonth() + 1 );
			rLOM.setDate( 0 );
			let rDaysOfMonth = nonLinearYear ? nonlinearMonthLengths[rLOM.getMonth()] : rLOM.getDate();

			if ( nonLinear ) {
				if ( dDaysOfMonth > rDaysOfMonth ) {
					dDaysOfMonth = rDaysOfMonth;
				} else {
					rDaysOfMonth = dDaysOfMonth;
				}
			}

			const yearDiff = dist.getFullYear() - _ref.getFullYear();

			// get linear value of distant time counted in months
			let dLinear = yearDiff * 12;
			dLinear += dist.getMonth();
			dLinear += ( ( nonLinear ? Math.min( dist.getDate(), dDaysOfMonth ) : dist.getDate() ) - 1 ) / dDaysOfMonth;
			dLinear += dist.getHours() / ( 24 * dDaysOfMonth );
			dLinear += dist.getMinutes() / ( 1440 * dDaysOfMonth );
			dLinear += dist.getSeconds() / ( 86400 * dDaysOfMonth );

			// get linear value of reference time counted in months
			let rLinear = 0; // due to yearDiff above
			rLinear += _ref.getMonth();
			rLinear += ( ( nonLinear ? Math.min( _ref.getDate(), rDaysOfMonth ) : _ref.getDate() ) - 1 ) / rDaysOfMonth;
			rLinear += _ref.getHours() / ( 24 * rDaysOfMonth );
			rLinear += _ref.getMinutes() / ( 1440 * rDaysOfMonth );
			rLinear += _ref.getSeconds() / ( 86400 * rDaysOfMonth );

			// get linear distance
			diff = sign * ( dLinear - rLinear );
			if ( _unit === "y" || _unit === "ny" ) {
				diff /= 12;
			}

			return Math.round( diff * distanceAccuracies[_unit] ) / distanceAccuracies[_unit];
		}
	}
}

/**
 * Adjusts timestamp using provided amount and unit.
 *
 * @param {*} timestamp timestamp to be adjusted
 * @param {number} amount amount of adjustment
 * @param {string} unit unit of adjustment, supports s for seconds (default), i for minutes, h for hours, d for days, w for weeks, m for months, y for years
 * @return {number} resulting number of seconds since Unix Epoch
 */
export function dateadd( timestamp = null, amount, unit = "s" ) {
	const _time = parsedate( timestamp );
	if ( isNaN( _time ) ) {
		return NaN;
	}

	const time = new Date( _time * 1000 );

	switch ( String( unit || "s" ).toLowerCase() ) {
		case "s" :
		default :
			time.setTime( time.getTime() + ( amount * 1000 ) );
			break;
		case "i" :
			time.setMinutes( time.getMinutes() + amount );
			break;
		case "h" :
			time.setHours( time.getHours() + amount );
			break;
		case "d" :
			time.setDate( time.getDate() + amount );
			break;
		case "w" :
			time.setDate( time.getDate() + ( 7 * amount ) );
			break;
		case "m" :
			time.setMonth( time.getMonth() + amount );
			break;
		case "y" :
			time.setFullYear( time.getFullYear() + amount );
			break;
	}

	return Math.round( time.getTime() / 1000 );
}
