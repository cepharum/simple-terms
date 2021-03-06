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

import Should from "should";

import { Functions } from "../";

describe( "Set of functions available in scope of a term", () => {
	it( "is available", () => {
		Should.exist( Functions );
	} );

	describe( "contains `isset` which", () => {
		it( "is a function", () => {
			Functions.isset.should.be.Function();
		} );

		it( "returns boolean false on calling w/o argument", () => {
			Functions.isset().should.be.false();
		} );

		it( "returns boolean false on calling w/ `null`", () => {
			Functions.isset( null ).should.be.false();
		} );

		it( "returns boolean false on calling w/ `undefined`", () => {
			Functions.isset( undefined ).should.be.false();
		} );

		it( "returns boolean true on calling w/ `false`", () => {
			Functions.isset( false ).should.be.true();
		} );

		it( "returns boolean true on calling w/ empty string", () => {
			Functions.isset( "" ).should.be.true();
		} );

		it( "returns boolean true on calling w/ zero", () => {
			Functions.isset( 0 ).should.be.true();
		} );

		it( "returns boolean true on calling w/ two arguments, `null` or `undefined` in first, but false, empty string or zero in second", () => {
			for ( const first of [ null, undefined ] ) {
				for ( const second of [ false, "", 0 ] ) {
					Functions.isset( first, second ).should.be.true();
				}
			}
		} );

		it( "returns boolean true on calling w/ more arguments, `null` or `undefined` in first three, but false, empty string or zero in last", () => {
			for ( const first of [ null, undefined ] ) {
				for ( const second of [ null, undefined ] ) {
					for ( const third of [ null, undefined ] ) {
						for ( const fourth of [ false, "", 0 ] ) {
							Functions.isset( first, second, third, fourth ).should.be.true();
						}
					}
				}
			}
		} );
	} );

	describe( "contains `empty` which", () => {
		it( "is a function", () => {
			Functions.empty.should.be.Function();
		} );

		it( "returns boolean true on calling w/o argument", () => {
			Functions.empty().should.be.true();
		} );

		it( "returns boolean true on calling w/ single argument that's either `null`, `undefined` or data resulting in empty string", () => {
			Functions.empty( null ).should.be.true();
			Functions.empty( undefined ).should.be.true();
			Functions.empty( "" ).should.be.true();
		} );

		it( "returns boolean true on calling w/ multiple arguments with every one either `null`, `undefined` or data resulting in empty string", () => {
			for ( const first of [ null, undefined, "", [] ] ) {
				for ( const second of [ null, undefined, "", [] ] ) {
					for ( const third of [ null, undefined, "", [] ] ) {
						for ( const fourth of [ null, undefined, "", [] ] ) {
							Functions.empty( first, second, third, fourth ).should.be.true();
						}
					}
				}
			}
		} );

		it( "returns boolean false on calling w/ multiple arguments with every argument but one either `null`, `undefined` or data resulting in empty string", () => {
			for ( const first of [ null, undefined, "", [] ] ) {
				for ( const second of [ null, undefined, "", [] ] ) {
					for ( const third of [ null, undefined, "", [] ] ) {
						for ( const fourth of [ null, undefined, "", [] ] ) {
							for ( const culprit of [ false, true, 0, 1, "0", {} ] ) {
								Functions.empty( culprit, first, second, third, fourth ).should.be.false();
								Functions.empty( first, culprit, second, third, fourth ).should.be.false();
								Functions.empty( first, second, culprit, third, fourth ).should.be.false();
								Functions.empty( first, second, third, culprit, fourth ).should.be.false();
								Functions.empty( first, second, third, fourth, culprit ).should.be.false();
							}
						}
					}
				}
			}
		} );
	} );

	describe( "contains `boolean` which", () => {
		it( "is a function", () => {
			Functions.boolean.should.be.Function();
		} );

		it( "returns boolean value of provided value in first provided argument", () => {
			Functions.boolean().should.be.false();
			Functions.boolean( null ).should.be.false();
			Functions.boolean( undefined ).should.be.false();
			Functions.boolean( "" ).should.be.false();

			Functions.boolean( [] ).should.be.true();
			Functions.boolean( {} ).should.be.true();
			Functions.boolean( "0" ).should.be.true();
			Functions.boolean( " " ).should.be.true();
		} );

		it( "ignores boolean value of any additional argument", () => {
			for ( const culprit of [ [], {}, "0", " " ] ) {
				Functions.boolean( null, culprit ).should.be.false();
				Functions.boolean( null, null, culprit ).should.be.false();
				Functions.boolean( null, null, null, culprit ).should.be.false();
			}
		} );
	} );

	describe( "contains `integer` which", () => {
		it( "is a function", () => {
			Functions.integer.should.be.Function();
		} );

		it( "returns NaN on providing non-numeric value in first argument", () => {
			Functions.integer().should.be.NaN();
			Functions.integer( null ).should.be.NaN();
			Functions.integer( undefined ).should.be.NaN();
			Functions.integer( "" ).should.be.NaN();
			Functions.integer( [] ).should.be.NaN();
			Functions.integer( {} ).should.be.NaN();
			Functions.integer( " " ).should.be.NaN();
		} );

		it( "returns numeric value of provided value in first argument containing something numeric", () => {
			Functions.integer( 0 ).should.be.Number().which.is.equal( 0 );
			Functions.integer( 1 ).should.be.Number().which.is.equal( 1 );

			Functions.integer( "0" ).should.be.Number().which.is.equal( 0 );
			Functions.integer( "1" ).should.be.Number().which.is.equal( 1 );
			Functions.integer( " 2" ).should.be.Number().which.is.equal( 2 );
			Functions.integer( " -3 " ).should.be.Number().which.is.equal( -3 );
			Functions.integer( "4 " ).should.be.Number().which.is.equal( 4 );

			Functions.integer( ["0"] ).should.be.Number().which.is.equal( 0 );
			Functions.integer( ["1"] ).should.be.Number().which.is.equal( 1 );
			Functions.integer( [" 2"] ).should.be.Number().which.is.equal( 2 );
			Functions.integer( [" -3 "] ).should.be.Number().which.is.equal( -3 );
			Functions.integer( ["4 "] ).should.be.Number().which.is.equal( 4 );

			Functions.integer( [0] ).should.be.Number().which.is.equal( 0 );
			Functions.integer( [1] ).should.be.Number().which.is.equal( 1 );
		} );

		it( "drops fractional part of numeric value in first provided argument", () => {
			Functions.integer( 0.0001 ).should.be.Number().which.is.equal( 0 );
			Functions.integer( -1.9 ).should.be.Number().which.is.equal( -1 );
		} );

		it( "ignores values provided in any additional argument", () => {
			Functions.integer( 5, 1 ).should.be.Number().which.is.equal( 5 );
			Functions.integer( 5, 1, 2 ).should.be.Number().which.is.equal( 5 );
			Functions.integer( 5, 1, 2, 3 ).should.be.Number().which.is.equal( 5 );
			Functions.integer( 5, 1, 2, 3, 4 ).should.be.Number().which.is.equal( 5 );
		} );
	} );

	describe( "contains `number` which", () => {
		it( "is a function", () => {
			Functions.number.should.be.Function();
		} );

		it( "returns NaN on providing non-numeric value in first argument", () => {
			Functions.number().should.be.NaN();
			Functions.number( null ).should.be.NaN();
			Functions.number( undefined ).should.be.NaN();
			Functions.number( "" ).should.be.NaN();
			Functions.number( [] ).should.be.NaN();
			Functions.number( {} ).should.be.NaN();
			Functions.number( " " ).should.be.NaN();
		} );

		it( "returns numeric value of provided value in first argument containing something numeric", () => {
			Functions.number( 0 ).should.be.Number().which.is.equal( 0 );
			Functions.number( 1 ).should.be.Number().which.is.equal( 1 );

			Functions.number( "0" ).should.be.Number().which.is.equal( 0 );
			Functions.number( "1" ).should.be.Number().which.is.equal( 1 );
			Functions.number( " 2" ).should.be.Number().which.is.equal( 2 );
			Functions.number( " -3 " ).should.be.Number().which.is.equal( -3 );
			Functions.number( "4 " ).should.be.Number().which.is.equal( 4 );

			Functions.number( ["0"] ).should.be.Number().which.is.equal( 0 );
			Functions.number( ["1"] ).should.be.Number().which.is.equal( 1 );
			Functions.number( [" 2"] ).should.be.Number().which.is.equal( 2 );
			Functions.number( [" -3 "] ).should.be.Number().which.is.equal( -3 );
			Functions.number( ["4 "] ).should.be.Number().which.is.equal( 4 );

			Functions.number( [0] ).should.be.Number().which.is.equal( 0 );
			Functions.number( [1] ).should.be.Number().which.is.equal( 1 );
		} );

		it( "ignores non-numeric tail of provided value", () => {
			Functions.number( "0 hello" ).should.be.Number().which.is.equal( 0 );
			Functions.number( "1 something" ).should.be.Number().which.is.equal( 1 );
			Functions.number( " 2 odd" ).should.be.Number().which.is.equal( 2 );
			Functions.number( " -3 follows" ).should.be.Number().which.is.equal( -3 );
			Functions.number( "4 thi!s number" ).should.be.Number().which.is.equal( 4 );
		} );

		it( "keeps fractional part of numeric value in first provided argument", () => {
			Functions.number( 0.0001 ).should.be.Number().which.is.equal( 0.0001 );
			Functions.number( -1.9 ).should.be.Number().which.is.equal( -1.9 );
		} );

		it( "accepts second argument selecting alternative decimal separator to support", () => {
			Functions.number( "5", "." ).should.be.Number().which.is.equal( 5 );
			Functions.number( "5", "," ).should.be.Number().which.is.equal( 5 );

			Functions.number( "5.3", "." ).should.be.Number().which.is.equal( 5.3 );
			Functions.number( "5.3", "," ).should.be.Number().which.is.equal( 5 );
			Functions.number( "+56.03", "." ).should.be.Number().which.is.equal( 56.03 );
			Functions.number( "+56.03", "," ).should.be.Number().which.is.equal( 56 );
			Functions.number( "-56.03", "." ).should.be.Number().which.is.equal( -56.03 );
			Functions.number( "-56.03", "," ).should.be.Number().which.is.equal( -56 );

			Functions.number( "5,3", "." ).should.be.Number().which.is.equal( 5 );
			Functions.number( "5,3", "," ).should.be.Number().which.is.equal( 5.3 );
			Functions.number( "+56,03", "." ).should.be.Number().which.is.equal( 56 );
			Functions.number( "+56,03", "," ).should.be.Number().which.is.equal( 56.03 );
			Functions.number( "-56,03", "." ).should.be.Number().which.is.equal( -56 );
			Functions.number( "-56,03", "," ).should.be.Number().which.is.equal( -56.03 );
		} );

		it( "accepts third argument selecting thousands separator to support", () => {
			Functions.number( "123 456", ".", " " ).should.be.Number().which.is.equal( 123456 );
			Functions.number( "123 456 789", ".", " " ).should.be.Number().which.is.equal( 123456789 );
			Functions.number( "+123 456", ".", " " ).should.be.Number().which.is.equal( 123456 );
			Functions.number( "-123 456", ".", " " ).should.be.Number().which.is.equal( -123456 );
			Functions.number( "123456", ".", " " ).should.be.Number().which.is.equal( 123456 );
			Functions.number( "123456789", ".", " " ).should.be.Number().which.is.equal( 123456789 );
			Functions.number( "+123456", ".", " " ).should.be.Number().which.is.equal( 123456 );
			Functions.number( "-123456", ".", " " ).should.be.Number().which.is.equal( -123456 );

			Functions.number( "1 23 456", ".", " " ).should.be.Number().which.is.equal( 1 );
			Functions.number( "12 3 456 789", ".", " " ).should.be.Number().which.is.equal( 12 );
			Functions.number( "12 3456 789", ".", " " ).should.be.Number().which.is.equal( 12 );
			Functions.number( "12 345 6 789", ".", " " ).should.be.Number().which.is.equal( 12345 );
			Functions.number( "+123 4 56", ".", " " ).should.be.Number().which.is.equal( 123 );
			Functions.number( "-123 45 6", ".", " " ).should.be.Number().which.is.equal( -123 );
			Functions.number( "1234 56", ".", " " ).should.be.Number().which.is.equal( 1234 );
			Functions.number( "123 45 6789", ".", " " ).should.be.Number().which.is.equal( 123 );
			Functions.number( "+1 23456", ".", " " ).should.be.Number().which.is.equal( 1 );
			Functions.number( "-1234 56", ".", " " ).should.be.Number().which.is.equal( -1234 );

			Functions.number( "123.456", ",", "." ).should.be.Number().which.is.equal( 123456 );
			Functions.number( "123.456.789", ",", "." ).should.be.Number().which.is.equal( 123456789 );
			Functions.number( "+123.456", ",", "." ).should.be.Number().which.is.equal( 123456 );
			Functions.number( "-123.456", ",", "." ).should.be.Number().which.is.equal( -123456 );
			Functions.number( "123456", ",", "." ).should.be.Number().which.is.equal( 123456 );
			Functions.number( "123456789", ",", "." ).should.be.Number().which.is.equal( 123456789 );
			Functions.number( "+123456", ",", "." ).should.be.Number().which.is.equal( 123456 );
			Functions.number( "-123456", ",", "." ).should.be.Number().which.is.equal( -123456 );

			Functions.number( "1.23.456", ",", "." ).should.be.Number().which.is.equal( 1 );
			Functions.number( "12.3.456 789", ",", "." ).should.be.Number().which.is.equal( 12 );
			Functions.number( "12.3456.789", ",", "." ).should.be.Number().which.is.equal( 12 );
			Functions.number( "12.345.6.789", ",", "." ).should.be.Number().which.is.equal( 12345 );
			Functions.number( "+123.4.56", ",", "." ).should.be.Number().which.is.equal( 123 );
			Functions.number( "-123.45.6", ",", "." ).should.be.Number().which.is.equal( -123 );
			Functions.number( "1234.56", ",", "." ).should.be.Number().which.is.equal( 1234 );
			Functions.number( "123.45.6789", ",", "." ).should.be.Number().which.is.equal( 123 );
			Functions.number( "+1.23456", ",", "." ).should.be.Number().which.is.equal( 1 );
			Functions.number( "-1234.56", ",", "." ).should.be.Number().which.is.equal( -1234 );

			Functions.number( "1 23 456", ",", "." ).should.be.Number().which.is.equal( 1 );
			Functions.number( "12 3 456 789", ",", "." ).should.be.Number().which.is.equal( 12 );
			Functions.number( "12 3456 789", ",", "." ).should.be.Number().which.is.equal( 12 );
			Functions.number( "12 345 6.789", ",", "." ).should.be.Number().which.is.equal( 12 );
			Functions.number( "+123 4 56", ",", "." ).should.be.Number().which.is.equal( 123 );
			Functions.number( "-123 45 6", ",", "." ).should.be.Number().which.is.equal( -123 );
			Functions.number( "1234 56", ",", "." ).should.be.Number().which.is.equal( 1234 );
			Functions.number( "123 45 6789", ",", "." ).should.be.Number().which.is.equal( 123 );
			Functions.number( "+1 23456", ",", "." ).should.be.Number().which.is.equal( 1 );
			Functions.number( "-1234 56", ",", "." ).should.be.Number().which.is.equal( -1234 );
		} );
	} );

	describe( "contains `string` which", () => {
		it( "is a function", () => {
			Functions.string.should.be.Function();
		} );

		it( "returns string value of provided value in first argument", () => {
			Functions.string().should.be.String().which.is.equal( "" );
			Functions.string( null ).should.be.String().which.is.equal( "" );
			Functions.string( undefined ).should.be.String().which.is.equal( "" );
			Functions.string( [] ).should.be.String().which.is.equal( "" );
			Functions.string( false ).should.be.String().which.is.equal( "false" );
			Functions.string( 0 ).should.be.String().which.is.equal( "0" );
			Functions.string( {} ).should.be.String().which.is.equal( "[object Object]" );
			Functions.string( "test" ).should.be.String().which.is.equal( "test" );
			Functions.string( "  hello\n world\n \t" ).should.be.String().which.is.equal( "  hello\n world\n \t" );
		} );

		it( "ignores values provided in any additional argument", () => {
			Functions.string( 1, 2 ).should.be.String().which.is.equal( "1" );
			Functions.string( 1, 2, 3 ).should.be.String().which.is.equal( "1" );
			Functions.string( 1, 2, 3, 4 ).should.be.String().which.is.equal( "1" );
			Functions.string( 1, 2, 3, 4, 5 ).should.be.String().which.is.equal( "1" );
		} );
	} );

	describe( "contains `trim` which", () => {
		it( "is a function", () => {
			Functions.trim.should.be.Function();
		} );

		it( "returns _trimmed_ string value of provided value in first argument", () => {
			Functions.trim().should.be.String().which.is.equal( "" );
			Functions.trim( null ).should.be.String().which.is.equal( "" );
			Functions.trim( undefined ).should.be.String().which.is.equal( "" );
			Functions.trim( [] ).should.be.String().which.is.equal( "" );
			Functions.trim( false ).should.be.String().which.is.equal( "false" );
			Functions.trim( 0 ).should.be.String().which.is.equal( "0" );
			Functions.trim( {} ).should.be.String().which.is.equal( "[object Object]" );
			Functions.trim( "  hello\n world\n \t" ).should.be.String().which.is.equal( "hello\n world" );
		} );

		it( "ignores values provided in any additional argument", () => {
			Functions.trim( 1, 2 ).should.be.String().which.is.equal( "1" );
			Functions.trim( 1, 2, 3 ).should.be.String().which.is.equal( "1" );
			Functions.trim( 1, 2, 3, 4 ).should.be.String().which.is.equal( "1" );
			Functions.trim( 1, 2, 3, 4, 5 ).should.be.String().which.is.equal( "1" );
		} );
	} );

	describe( "contains `normalize` which", () => {
		it( "is a function", () => {
			Functions.normalize.should.be.Function();
		} );

		it( "returns _trimmed and normalized_ string value of provided value in first argument", () => {
			Functions.normalize().should.be.String().which.is.equal( "" );
			Functions.normalize( null ).should.be.String().which.is.equal( "" );
			Functions.normalize( undefined ).should.be.String().which.is.equal( "" );
			Functions.normalize( [] ).should.be.String().which.is.equal( "" );
			Functions.normalize( false ).should.be.String().which.is.equal( "false" );
			Functions.normalize( 0 ).should.be.String().which.is.equal( "0" );
			Functions.normalize( {} ).should.be.String().which.is.equal( "[object Object]" );
			Functions.normalize( "  hello\n world\n \t" ).should.be.String().which.is.equal( "hello world" );
		} );

		it( "ignores values provided in any additional argument", () => {
			Functions.normalize( 1, 2 ).should.be.String().which.is.equal( "1" );
			Functions.normalize( 1, 2, 3 ).should.be.String().which.is.equal( "1" );
			Functions.normalize( 1, 2, 3, 4 ).should.be.String().which.is.equal( "1" );
			Functions.normalize( 1, 2, 3, 4, 5 ).should.be.String().which.is.equal( "1" );
		} );
	} );

	describe( "contains `round` which", () => {
		it( "is a function", () => {
			Functions.round.should.be.Function();
		} );

		it( "returns NaN on providing non-numeric value in first argument", () => {
			Functions.round().should.be.NaN();
			Functions.round( null ).should.be.NaN();
			Functions.round( undefined ).should.be.NaN();
			Functions.round( false ).should.be.NaN();
			Functions.round( "" ).should.be.NaN();
		} );

		it( "returns numeric value provided in first argument rounded to closest integer value by default", () => {
			Functions.round( 0.4 ).should.be.Number().which.is.equal( 0 );
			Functions.round( -0.4 ).should.be.Number().which.is.equal( 0 );
			Functions.round( 1.5 ).should.be.Number().which.is.equal( 2 );
			Functions.round( -1.5 ).should.be.Number().which.is.equal( -2 );
		} );

		it( "accepts precision value in second argument selecting number of fractional digits to keep on rounding", () => {
			Functions.round( 1.5, 0 ).should.be.Number().which.is.equal( 2 );
			Functions.round( 1.5, 1 ).should.be.Number().which.is.equal( 1.5 );
			Functions.round( 1.5, 2 ).should.be.Number().which.is.equal( 1.5 );
			Functions.round( 1.5, 3 ).should.be.Number().which.is.equal( 1.5 );
		} );

		it( "accepts negative precision value in second argument selecting number of fractional digits to keep on rounding", () => {
			Functions.round( 1.5, -1 ).should.be.Number().which.is.equal( 0 );
			Functions.round( 15, -1 ).should.be.Number().which.is.equal( 20 );
			Functions.round( 15, -2 ).should.be.Number().which.is.equal( 0 );
			Functions.round( 515, -2 ).should.be.Number().which.is.equal( 500 );
			Functions.round( 515, -3 ).should.be.Number().which.is.equal( 1000 );
			Functions.round( -1.5, -1 ).should.be.Number().which.is.equal( 0 );
			Functions.round( -15, -1 ).should.be.Number().which.is.equal( -20 );
			Functions.round( -15, -2 ).should.be.Number().which.is.equal( 0 );
			Functions.round( -515, -2 ).should.be.Number().which.is.equal( -500 );
			Functions.round( -515, -3 ).should.be.Number().which.is.equal( -1000 );
		} );

		it( "truncates precision value obeying its non-fractional digits, only", () => {
			Functions.round( 1.5, 0 ).should.be.Number().which.is.equal( 2 );
			Functions.round( 1.5, 0.4 ).should.be.Number().which.is.equal( 2 );
			Functions.round( 1.5, 0.6 ).should.be.Number().which.is.equal( 2 );
			Functions.round( 1.5, 1 ).should.be.Number().which.is.equal( 1.5 );
			Functions.round( 1.5, 1.3 ).should.be.Number().which.is.equal( 1.5 );
			Functions.round( 1.5, 1.5 ).should.be.Number().which.is.equal( 1.5 );

			Functions.round( 1.5, 0 ).should.be.Number().which.is.equal( 2 );
			Functions.round( 1.5, -0.4 ).should.be.Number().which.is.equal( 2 );
			Functions.round( 1.5, -0.6 ).should.be.Number().which.is.equal( 2 );
			Functions.round( 1.5, -1 ).should.be.Number().which.is.equal( 0 );
			Functions.round( 1.5, -1.3 ).should.be.Number().which.is.equal( 0 );
			Functions.round( 1.5, -1.5 ).should.be.Number().which.is.equal( 0 );
		} );
	} );

	describe( "contains `sum` which", () => {
		it( "is a function", () => {
			Functions.sum.should.be.Function();
		} );

		it( "calculates sum of all numeric values in an array provided as first argument", () => {
			Functions.sum( [ "1", 2, 3.0, 4, 5, 6 ] ).should.be.Number().and.equal( 21 );
		} );

		it( "ignores any non-numeric value in provided array", () => {
			Functions.sum( [ null, "1", undefined, 2, false, 3, true, 4, [], 5, {}, 6, "hello" ] ).should.be.Number().and.equal( 21 );
		} );

		it( "returns 0 on empty array", () => {
			Functions.sum( [] ).should.be.Number().which.is.equal( 0 );
		} );

		it( "returns 0 on array not containing any numeric value", () => {
			Functions.sum( [ null, undefined, false, true, "", {}, [] ] ).should.be.Number().which.is.equal( 0 );
		} );

		it( "returns NaN on providing anything but an array in first argument", () => {
			Functions.sum().should.be.NaN();
			Functions.sum( null ).should.be.NaN();
			Functions.sum( undefined ).should.be.NaN();
			Functions.sum( false ).should.be.NaN();
			Functions.sum( true ).should.be.NaN();
			Functions.sum( "" ).should.be.NaN();
			Functions.sum( {} ).should.be.NaN();
		} );

		it( "ignores any additional argument", () => {
			Functions.sum( [ 1, 2 ] ).should.be.Number().and.equal( 3 );
			Functions.sum( [ 1, 2 ], [ 3, 4 ] ).should.be.Number().and.equal( 3 );
			Functions.sum( [ 1, 2 ], [ 3, 4 ], [ 5, 6 ] ).should.be.Number().and.equal( 3 );
		} );
	} );

	describe( "contains `count` which", () => {
		it( "is a function", () => {
			Functions.count.should.be.Function();
		} );

		it( "returns number of actual numeric values values in an array provided as first argument", () => {
			Functions.count( [ "1", 2, 3.0, 4, 5, 6 ] ).should.be.Number().and.equal( 6 );
		} );

		it( "ignores any non-numeric value in provided array", () => {
			Functions.count( [ null, "1", undefined, 2, false, 3, true, 4, [], 5, {}, 6, "hello" ] ).should.be.Number().and.equal( 6 );
		} );

		it( "returns 0 on empty array", () => {
			Functions.count( [] ).should.be.Number().which.is.equal( 0 );
		} );

		it( "returns 0 on array not containing any numeric value", () => {
			Functions.count( [ null, undefined, false, true, "", {}, [] ] ).should.be.Number().which.is.equal( 0 );
		} );

		it( "returns NaN on providing anything but an array in first argument", () => {
			Functions.count().should.be.NaN();
			Functions.count( null ).should.be.NaN();
			Functions.count( undefined ).should.be.NaN();
			Functions.count( false ).should.be.NaN();
			Functions.count( true ).should.be.NaN();
			Functions.count( "" ).should.be.NaN();
			Functions.count( {} ).should.be.NaN();
		} );

		it( "ignores any additional argument", () => {
			Functions.count( [ 1, 2 ] ).should.be.Number().and.equal( 2 );
			Functions.count( [ 1, 2 ], [ 3, 4 ] ).should.be.Number().and.equal( 2 );
			Functions.count( [ 1, 2 ], [ 3, 4 ], [ 5, 6 ] ).should.be.Number().and.equal( 2 );
		} );
	} );

	describe( "contains `average` which", () => {
		it( "is a function", () => {
			Functions.average.should.be.Function();
		} );

		it( "calculates average of all numeric values in an array provided as first argument", () => {
			Functions.average( [ "1", 2, 4.0, 4, 5 ] ).should.be.Number().and.equal( 3.2 );
		} );

		it( "ignores any non-numeric value in provided array", () => {
			Functions.average( [ null, "1", undefined, 2, false, 4.0, true, 4, [], 5, {}, "hello" ] ).should.be.Number().and.equal( 3.2 );
		} );

		it( "returns NaN on empty array", () => {
			Functions.average( [] ).should.be.NaN();
		} );

		it( "returns NaN on array not containing any numeric value", () => {
			Functions.average( [ null, undefined, false, true, "", {}, [] ] ).should.be.NaN();
		} );

		it( "returns NaN on providing anything but an array in first argument", () => {
			Functions.average().should.be.NaN();
			Functions.average( null ).should.be.NaN();
			Functions.average( undefined ).should.be.NaN();
			Functions.average( false ).should.be.NaN();
			Functions.average( true ).should.be.NaN();
			Functions.average( "" ).should.be.NaN();
			Functions.average( {} ).should.be.NaN();
		} );

		it( "ignores any additional argument", () => {
			Functions.average( [ 1, 2 ] ).should.be.Number().and.equal( 1.5 );
			Functions.average( [ 1, 2 ], [ 3, 4 ] ).should.be.Number().and.equal( 1.5 );
			Functions.average( [ 1, 2 ], [ 3, 4 ], [ 5, 6 ] ).should.be.Number().and.equal( 1.5 );
		} );
	} );

	describe( "contains `median` which", () => {
		it( "is a function", () => {
			Functions.median.should.be.Function();
		} );

		it( "calculates median of all numeric values in an array provided as first argument", () => {
			Functions.median( [ "1", 2, 4.0, 4, 5 ] ).should.be.Number().and.equal( 4 );
		} );

		it( "sorts numeric values before calculating their median", () => {
			Functions.median( [ 2, 5, "1", 4.0, 4 ] ).should.be.Number().and.equal( 4 );
		} );

		it( "ignores any non-numeric value in provided array", () => {
			Functions.median( [ null, "1", undefined, 5, false, 2, 4.0, true, 4, [], {}, "hello" ] ).should.be.Number().and.equal( 4 );
		} );

		it( "returns NaN on empty array", () => {
			Functions.median( [] ).should.be.NaN();
		} );

		it( "returns NaN on array not containing any numeric value", () => {
			Functions.median( [ null, undefined, false, true, "", {}, [] ] ).should.be.NaN();
		} );

		it( "returns NaN on providing anything but an array in first argument", () => {
			Functions.median().should.be.NaN();
			Functions.median( null ).should.be.NaN();
			Functions.median( undefined ).should.be.NaN();
			Functions.median( false ).should.be.NaN();
			Functions.median( true ).should.be.NaN();
			Functions.median( "" ).should.be.NaN();
			Functions.median( {} ).should.be.NaN();
		} );

		it( "ignores any additional argument", () => {
			Functions.median( [ 1, 2 ] ).should.be.Number().and.equal( 1.5 );
			Functions.median( [ 1, 2 ], [ 3, 4 ] ).should.be.Number().and.equal( 1.5 );
			Functions.median( [ 1, 2 ], [ 3, 4 ], [ 5, 6 ] ).should.be.Number().and.equal( 1.5 );
		} );
	} );

	describe( "contains `concat` which", () => {
		it( "is a function", () => {
			Functions.concat.should.be.Function();
		} );

		it( "returns empty array on invoking w/o any argument", () => {
			Functions.concat().should.be.Array().which.is.empty();
		} );

		it( "returns empty array on invoking w/ empty array in sole argument", () => {
			Functions.concat( [] ).should.be.Array().which.is.empty();
		} );

		it( "returns array purely consisting of provided sole non-array argument", () => {
			Functions.concat( null ).should.be.Array().which.is.deepEqual( [null] );
			Functions.concat( undefined ).should.be.Array().which.is.deepEqual( [undefined] );
			Functions.concat( "" ).should.be.Array().which.is.deepEqual( [""] );
			Functions.concat( "test" ).should.be.Array().which.is.deepEqual( ["test"] );
			Functions.concat( false ).should.be.Array().which.is.deepEqual( [false] );
			Functions.concat( true ).should.be.Array().which.is.deepEqual( [true] );
			Functions.concat( 0 ).should.be.Array().which.is.deepEqual( [0] );
			Functions.concat( -10 ).should.be.Array().which.is.deepEqual( [-10] );
			Functions.concat( 10 ).should.be.Array().which.is.deepEqual( [10] );
			Functions.concat( {} ).should.be.Array().which.is.deepEqual( [{}] );
		} );

		it( "returns array purely consisting of all provided non-array arguments", () => {
			Functions.concat( null, undefined, "", "test", false, true, 0, -10, 10, {} )
				.should.be.Array().which.is.deepEqual( [ null, undefined, "", "test", false, true, 0, -10, 10, {} ] );
		} );

		it( "returns flat array consisting of all elements provided in array arguments", () => {
			Functions.concat( [ null, undefined, "" ], ["test"], [ false, true, 0, -10, 10, {} ] )
				.should.be.Array().which.is.deepEqual( [ null, undefined, "", "test", false, true, 0, -10, 10, {} ] );
		} );

		it( "returns flat array merging elements of array arguments with values of non-array arguments", () => {
			Functions.concat( null, [undefined], "", ["test"], [ false, true ], 0, [ -10, 10, {} ] )
				.should.be.Array().which.is.deepEqual( [ null, undefined, "", "test", false, true, 0, -10, 10, {} ] );
		} );
	} );

	describe( "contains `length` which", () => {
		it( "is a function", () => {
			Functions.length.should.be.Function();
		} );

		it( "returns number of elements in an array provided as first argument", () => {
			Functions.length( [] ).should.be.Number().which.is.equal( 0 );
			Functions.length( [null] ).should.be.Number().which.is.equal( 1 );
			Functions.length( [ null, undefined ] ).should.be.Number().which.is.equal( 2 );
			Functions.length( [ null, undefined, false, true, "", "test" ] ).should.be.Number().which.is.equal( 6 );
			Functions.length( ["test"] ).should.be.Number().which.is.equal( 1 );
		} );

		it( "returns number of characters in a array provided as first argument", () => {
			Functions.length( "" ).should.be.Number().which.is.equal( 0 );
			Functions.length( "hello" ).should.be.Number().which.is.equal( 5 );
		} );

		it( "returns NaN on providing neither array nor string in first argument", () => {
			Functions.length().should.be.NaN();
			Functions.length( null ).should.be.NaN();
			Functions.length( undefined ).should.be.NaN();
			Functions.length( false ).should.be.NaN();
			Functions.length( true ).should.be.NaN();
			Functions.length( 0 ).should.be.NaN();
			Functions.length( -10 ).should.be.NaN();
			Functions.length( {} ).should.be.NaN();
		} );

		it( "ignores additional arguments", () => {
			Functions.length( [], [] ).should.be.Number().which.is.equal( 0 );
			Functions.length( [], [null] ).should.be.Number().which.is.equal( 0 );
			Functions.length( [], [null], [undefined] ).should.be.Number().which.is.equal( 0 );
			Functions.length( [], [null], [undefined], [ false, true, "", "test" ] ).should.be.Number().which.is.equal( 0 );
		} );
	} );

	describe( "contains `indexof` which", () => {
		it( "is a function", () => {
			Functions.indexof.should.be.Function();
		} );

		it( "finds element in a given array matching given string", () => {
			Functions.indexof( [ "foo", "bar", "baz", "bam" ], "baz" ).should.be.Number().which.is.equal( 2 );
			Functions.indexof( [ 1, 2, 10, 23, 50 ], "23" ).should.be.Number().which.is.equal( 3 );
			Functions.indexof( [ "23", "45", "678" ], 23.0 ).should.be.Number().which.is.equal( 0 );
		} );

		it( "does not find elements in a given array on given string matching elements partially, only", () => {
			Functions.indexof( [ "foo", "bar", "baz", "bam" ], "az" ).should.be.Number().which.is.equal( -1 );
			Functions.indexof( [ 1, 2, 10, 23, 50 ], "3" ).should.be.Number().which.is.equal( -1 );
			Functions.indexof( [ "23", "45", "678" ], 5.0 ).should.be.Number().which.is.equal( -1 );
		} );

		it( "finds element in a given array matching given regular expression", () => {
			Functions.indexof( [ "foo", "bar", "baz", "bam" ], "ba[rz]", true ).should.be.Number().which.is.equal( 1 );
			Functions.indexof( [ 1, 2, 10, 23, 50 ], "23?", true ).should.be.Number().which.is.equal( 1 );
		} );

		it( "never finds anything when providing non-array in first argument", () => {
			Functions.indexof( null, null ).should.be.Number().which.is.equal( -1 );
			Functions.indexof( undefined, undefined ).should.be.Number().which.is.equal( -1 );
			Functions.indexof( false, false ).should.be.Number().which.is.equal( -1 );
			Functions.indexof( true, true ).should.be.Number().which.is.equal( -1 );
			Functions.indexof( "", "" ).should.be.Number().which.is.equal( -1 );
			Functions.indexof( "test", "test" ).should.be.Number().which.is.equal( -1 );
			Functions.indexof( 0, 0 ).should.be.Number().which.is.equal( -1 );
			Functions.indexof( 1, 1 ).should.be.Number().which.is.equal( -1 );
			Functions.indexof( -100, -100 ).should.be.Number().which.is.equal( -1 );
			Functions.indexof( { test: 1 }, "test" ).should.be.Number().which.is.equal( -1 );
			Functions.indexof( { test: 1 }, 1 ).should.be.Number().which.is.equal( -1 );
		} );
	} );

	describe( "contains `item` which", () => {
		it( "is a function", () => {
			Functions.item.should.be.Function();
		} );

		it( "retrieves element from array selected by its 0-based numeric index", () => {
			const list = [ null, undefined, false, true, "", "test", 0, 1, -10, [], {} ];

			const numItems = list.length;
			for ( let i = 0; i < numItems; i++ ) {
				const needle = list[i];

				Should( Functions.item( list, i ) ).be.equal( needle );
			}
		} );

		it( "returns `null` on providing index beyond range of available elements", () => {
			Should( Functions.item( [ "a", "b", "c", "d" ], -2 ) ).be.null();
			Should( Functions.item( [ "a", "b", "c", "d" ], -1 ) ).be.null();
			Should( Functions.item( [ "a", "b", "c", "d" ], 0 ) ).be.equal( "a" );
			Should( Functions.item( [ "a", "b", "c", "d" ], 1.0 ) ).be.equal( "b" );
			Should( Functions.item( [ "a", "b", "c", "d" ], "2" ) ).be.equal( "c" );
			Should( Functions.item( [ "a", "b", "c", "d" ], 3 ) ).be.equal( "d" );
			Should( Functions.item( [ "a", "b", "c", "d" ], 3.6 ) ).be.equal( "d" );
			Should( Functions.item( [ "a", "b", "c", "d" ], 4 ) ).be.null();
			Should( Functions.item( [ "a", "b", "c", "d" ], 5 ) ).be.null();
		} );

		it( "returns `null` on trying to select from non-array source in first argument", () => {
			Should( Functions.item( null, 0 ) ).be.null();
			Should( Functions.item( undefined, 0 ) ).be.null();
			Should( Functions.item( false, 0 ) ).be.null();
			Should( Functions.item( true, 0 ) ).be.null();
			Should( Functions.item( 0, 0 ) ).be.null();
			Should( Functions.item( 1, 0 ) ).be.null();
			Should( Functions.item( -100, 0 ) ).be.null();
			Should( Functions.item( "", 0 ) ).be.null();
			Should( Functions.item( "test", 0 ) ).be.null();
			Should( Functions.item( {}, 0 ) ).be.null();
		} );

		it( "returns value in third argument instead of `null` on invalid selection of element", () => {
			Should( Functions.item( [ "a", "b", "c", "d" ], -2, "my default" ) ).be.equal( "my default" );
			Should( Functions.item( [ "a", "b", "c", "d" ], -1, "my default" ) ).be.equal( "my default" );
			Should( Functions.item( [ "a", "b", "c", "d" ], 0, "my default" ) ).be.equal( "a" );
			Should( Functions.item( [ "a", "b", "c", "d" ], 1, "my default" ) ).be.equal( "b" );
			Should( Functions.item( [ "a", "b", "c", "d" ], 2, "my default" ) ).be.equal( "c" );
			Should( Functions.item( [ "a", "b", "c", "d" ], 3, "my default" ) ).be.equal( "d" );
			Should( Functions.item( [ "a", "b", "c", "d" ], 4, "my default" ) ).be.equal( "my default" );
			Should( Functions.item( [ "a", "b", "c", "d" ], 5, "my default" ) ).be.equal( "my default" );

			Should( Functions.item( null, 0, "my default" ) ).be.equal( "my default" );
			Should( Functions.item( undefined, 0, "my default" ) ).be.equal( "my default" );
			Should( Functions.item( false, 0, "my default" ) ).be.equal( "my default" );
			Should( Functions.item( true, 0, "my default" ) ).be.equal( "my default" );
			Should( Functions.item( 0, 0, "my default" ) ).be.equal( "my default" );
			Should( Functions.item( 1, 0, "my default" ) ).be.equal( "my default" );
			Should( Functions.item( -100, 0, "my default" ) ).be.equal( "my default" );
			Should( Functions.item( "", 0, "my default" ) ).be.equal( "my default" );
			Should( Functions.item( "test", 0, "my default" ) ).be.equal( "my default" );
			Should( Functions.item( {}, 0, "my default" ) ).be.equal( "my default" );
		} );
	} );

	describe( "contains `array` which", () => {
		it( "is a function", () => {
			Functions.array.should.be.Function();
		} );

		it( "returns empty array on calling w/o providing any argument", () => {
			Functions.array().should.be.Array().which.is.empty();
		} );

		it( "returns single-item array containing sole argument", () => {
			const list = [ null, undefined, false, true, 0, 1, "", "test", {}, [], ["test"] ];

			for ( const first of list ) {
				Functions.array( first ).should.be.Array().which.is.deepEqual( [first] );
			}
		} );

		it( "returns array containing all arguments in same order as provided", function() {
			this.timeout( 10000 );

			const list = [ null, undefined, false, true, 0, 1, "", "test", {}, [], ["test"] ];

			for ( const first of list ) {
				for ( const second of list ) {
					for ( const third of list ) {
						for ( const fourth of list ) {
							Functions.array( first, second, third, fourth )
								.should.be.Array().which.is.deepEqual( [ first, second, third, fourth ] );
						}
					}
				}
			}
		} );
	} );

	describe( "contains `filter` which", () => {
		it( "is a function", () => {
			Functions.filter.should.be.Function();
		} );

		it( "returns array provided in first argument with all falsy elements removed", () => {
			Functions.filter( [ null, undefined, false, "", 0 ] ).should.be.Array().which.is.empty();
			Functions.filter( [ null, 1, undefined, "large", false, "liger", "", "jumps", 0 ] )
				.should.be.Array().which.is.deepEqual( [ 1, "large", "liger", "jumps" ] );
			Functions.filter( [ 1, null, "large", undefined, "liger", false, "jumps", "", "for", 0, "bite" ] )
				.should.be.Array().which.is.deepEqual( [ 1, "large", "liger", "jumps", "for", "bite" ] );
		} );

		it( "returns empty array on providing falsy non-array value", () => {
			Functions.filter( null ).should.be.Array().which.is.empty();
			Functions.filter( undefined ).should.be.Array().which.is.empty();
			Functions.filter( false ).should.be.Array().which.is.empty();
			Functions.filter( 0 ).should.be.Array().which.is.empty();
			Functions.filter( "" ).should.be.Array().which.is.empty();
		} );

		it( "returns array solely containing truthy non-array value in first argument", () => {
			Functions.filter( true ).should.be.Array().which.is.deepEqual( [true] );
			Functions.filter( 1 ).should.be.Array().which.is.deepEqual( [1] );
			Functions.filter( "test" ).should.be.Array().which.is.deepEqual( ["test"] );
			Functions.filter( {} ).should.be.Array().which.is.deepEqual( [{}] );
			Functions.filter( { test: true } ).should.be.Array().which.is.deepEqual( [{ test: true }] );
		} );

		it( "ignores any additional argument on filtering first one", () => {
			Functions.filter( [ null, undefined, false, "", 0 ], [1] ).should.be.Array().which.is.empty();
			Functions.filter( [ null, 1, undefined, "large", false, "liger", "", "jumps", 0 ], [1] )
				.should.be.Array().which.is.deepEqual( [ 1, "large", "liger", "jumps" ] );
			Functions.filter( [ 1, null, "large", undefined, "liger", false, "jumps", "", "for", 0, "bite" ] )
				.should.be.Array().which.is.deepEqual( [ 1, "large", "liger", "jumps", "for", "bite" ], [1] );

			Functions.filter( null, [1] ).should.be.Array().which.is.empty();
			Functions.filter( undefined, [1] ).should.be.Array().which.is.empty();
			Functions.filter( false, [1] ).should.be.Array().which.is.empty();
			Functions.filter( 0, [1] ).should.be.Array().which.is.empty();
			Functions.filter( "", [1] ).should.be.Array().which.is.empty();

			Functions.filter( true, [1] ).should.be.Array().which.is.deepEqual( [true] );
			Functions.filter( 1, [1] ).should.be.Array().which.is.deepEqual( [1] );
			Functions.filter( "test", [1] ).should.be.Array().which.is.deepEqual( ["test"] );
			Functions.filter( {}, [1] ).should.be.Array().which.is.deepEqual( [{}] );
			Functions.filter( { test: true }, [1] ).should.be.Array().which.is.deepEqual( [{ test: true }] );
		} );
	} );

	describe( "contains `join` which", () => {
		it( "is a function", () => {
			Functions.join.should.be.Function();
		} );

		it( "returns empty string on providing empty array in first argument", () => {
			Functions.join( [] ).should.be.String().which.is.empty();
		} );

		it( "returns empty string on providing false non-array in first argument", () => {
			Functions.join( null ).should.be.String().which.is.empty();
			Functions.join( undefined ).should.be.String().which.is.empty();
			Functions.join( false ).should.be.String().which.is.empty();
			Functions.join( "" ).should.be.String().which.is.empty();
			Functions.join( 0 ).should.be.String().which.is.empty();
		} );

		it( "returns provided truthy non-array value in first argument as string", () => {
			Functions.join( true ).should.be.String().which.is.deepEqual( "true" );
			Functions.join( 1 ).should.be.String().which.is.deepEqual( "1" );
			Functions.join( "0" ).should.be.String().which.is.deepEqual( "0" );
			Functions.join( [] ).should.be.String().which.is.deepEqual( "" );
			Functions.join( {} ).should.be.String().which.is.deepEqual( "[object Object]" );
		} );

		it( "returns empty string on providing empty array in first argument with any glue in second argument", () => {
			for ( const glue of [ "", "1", "test", true, false, null, undefined, 0, 1, -10, [], {} ] ) {
				Functions.join( [], glue ).should.be.String().which.is.empty();
			}
		} );

		it( "returns sole element in provided array as string with any glue given in second argument", () => {
			for ( const glue of [ "", "1", "test", true, false, null, undefined, 0, 1, -10, [], {} ] ) {
				Functions.join( ["test"], glue ).should.be.String().which.is.equal( "test" );
				Functions.join( [123], glue ).should.be.String().which.is.equal( "123" );
			}
		} );

		it( "returns string containing all elements of provided array as strings", () => {
			Functions.join( [ "this", ["is"], "number", 5 ] ).should.be.String().which.is.equal( "thisisnumber5" );
		} );

		it( "returns string containing all elements of provided array as strings with given glue in between", () => {
			Functions.join( [ "this", ["is"], "number", 5 ], " " ).should.be.String().which.is.equal( "this is number 5" );
			Functions.join( [ "this", ["is"], "number", 5 ], "-" ).should.be.String().which.is.equal( "this-is-number-5" );
		} );
	} );

	describe( "contains `split` which", () => {
		it( "is a function", () => {
			Functions.split.should.be.Function();
		} );

		it( "returns array with parts of provided string separated by a given separator string", () => {
			Functions.split( "some,string,with,commata", "," )
				.should.be.an.Array()
				.which.is.deepEqual( [ "some", "string", "with", "commata" ] );
		} );

		it( "returns array with parts of provided string separated by a regular expression given by source", () => {
			Functions.split( "some,string-with,commata", "[,-]", true )
				.should.be.an.Array()
				.which.is.deepEqual( [ "some", "string", "with", "commata" ] );

			Functions.split( "some,string-with,commata", "/[,-]/", true )
				.should.be.an.Array()
				.which.is.deepEqual( [ "some", "string", "with", "commata" ] );

			Functions.split( "some,string-with,commata", "m", true )
				.should.be.an.Array()
				.which.is.deepEqual( [ "so", "e,string-with,co", "", "ata" ] );

			Functions.split( "some,string-with,commata", "/M/i", true )
				.should.be.an.Array()
				.which.is.deepEqual( [ "so", "e,string-with,co", "", "ata" ] );
		} );

		it( "returns array with characters of provided string when omitting separator", () => {
			Functions.split( "some,string" )
				.should.be.an.Array()
				.which.is.deepEqual( [ "s", "o", "m", "e", ",", "s", "t", "r", "i", "n", "g" ] );
		} );
	} );

	describe( "contains `test` which", () => {
		it( "is a function", () => {
			Functions.test.should.be.Function();
		} );

		it( "returns second argument if first one is truthy", () => {
			Functions.test( true, "good" ).should.be.String().which.is.equal( "good" );
			Functions.test( "0", "good" ).should.be.String().which.is.equal( "good" );
			Functions.test( 1, "good" ).should.be.String().which.is.equal( "good" );
			Functions.test( [], "good" ).should.be.String().which.is.equal( "good" );
			Functions.test( {}, "good" ).should.be.String().which.is.equal( "good" );
		} );

		it( "returns null if first one is falsy on calling with two arguments, only", () => {
			Should( Functions.test( null, "good" ) ).be.null();
			Should( Functions.test( undefined, "good" ) ).be.null();
			Should( Functions.test( false, "good" ) ).be.null();
			Should( Functions.test( 0, "good" ) ).be.null();
			Should( Functions.test( "", "good" ) ).be.null();
		} );

		it( "returns third argument if first one is falsy on calling with three arguments, only", () => {
			Functions.test( null, "good", "bad" ).should.be.String().which.is.equal( "bad" );
			Functions.test( undefined, "good", "bad" ).should.be.String().which.is.equal( "bad" );
			Functions.test( false, "good", "bad" ).should.be.String().which.is.equal( "bad" );
			Functions.test( 0, "good", "bad" ).should.be.String().which.is.equal( "bad" );
			Functions.test( "", "good", "bad" ).should.be.String().which.is.equal( "bad" );
		} );
	} );

	describe( "contains `lowercase` which", () => {
		it( "is a function", () => {
			Functions.lowercase.should.be.Function();
		} );

		it( "returns string provided in first argument with all uppercase characters converted to lowercase", () => {
			Functions.lowercase( "good" ).should.be.String().which.is.equal( "good" );
			Functions.lowercase( "GOOD" ).should.be.String().which.is.equal( "good" );
			Functions.lowercase( "Good" ).should.be.String().which.is.equal( "good" );
			Functions.lowercase( "gOod" ).should.be.String().which.is.equal( "good" );
			Functions.lowercase( "goOd" ).should.be.String().which.is.equal( "good" );
			Functions.lowercase( "gooD" ).should.be.String().which.is.equal( "good" );
			Functions.lowercase( "gOOD" ).should.be.String().which.is.equal( "good" );
			Functions.lowercase( "GoOD" ).should.be.String().which.is.equal( "good" );
			Functions.lowercase( "GOoD" ).should.be.String().which.is.equal( "good" );
			Functions.lowercase( "GOOd" ).should.be.String().which.is.equal( "good" );
		} );

		it( "works locale-aware", () => {
			Functions.lowercase( "MÄCHTIG" ).should.be.String().which.is.equal( "mächtig" );
			Functions.lowercase( "ÉÂ" ).should.be.String().which.is.equal( "éâ" );
		} );
	} );

	describe( "contains `uppercase` which", () => {
		it( "is a function", () => {
			Functions.uppercase.should.be.Function();
		} );

		it( "returns string provided in first argument with all lowercase characters converted to uppercase", () => {
			Functions.uppercase( "GOOD" ).should.be.String().which.is.equal( "GOOD" );
			Functions.uppercase( "good" ).should.be.String().which.is.equal( "GOOD" );
			Functions.uppercase( "Good" ).should.be.String().which.is.equal( "GOOD" );
			Functions.uppercase( "gOod" ).should.be.String().which.is.equal( "GOOD" );
			Functions.uppercase( "goOd" ).should.be.String().which.is.equal( "GOOD" );
			Functions.uppercase( "gooD" ).should.be.String().which.is.equal( "GOOD" );
			Functions.uppercase( "gOOD" ).should.be.String().which.is.equal( "GOOD" );
			Functions.uppercase( "GoOD" ).should.be.String().which.is.equal( "GOOD" );
			Functions.uppercase( "GOoD" ).should.be.String().which.is.equal( "GOOD" );
			Functions.uppercase( "GOOd" ).should.be.String().which.is.equal( "GOOD" );
		} );

		it( "works locale-aware", () => {
			Functions.uppercase( "mächtig" ).should.be.String().which.is.equal( "MÄCHTIG" );
			Functions.uppercase( "éâ" ).should.be.String().which.is.equal( "ÉÂ" );
		} );
	} );

	describe( "contains `first` which", () => {
		it( "is a function", () => {
			Functions.first.should.be.Function();
		} );

		it( "returns first non-null argument", () => {
			const value = {};

			Functions.first( value ).should.be.equal( value );

			Functions.first( null, value ).should.be.equal( value );
			Functions.first( undefined, value ).should.be.equal( value );
			Functions.first( false, value ).should.be.equal( false );

			Functions.first( undefined, null, value ).should.be.equal( value );
			Functions.first( null, undefined, value ).should.be.equal( value );
			Functions.first( null, null, value ).should.be.equal( value );
			Functions.first( undefined, undefined, value ).should.be.equal( value );
			Functions.first( null, false, value ).should.be.equal( false );
			Functions.first( undefined, false, value ).should.be.equal( false );
		} );
	} );

	describe( "contains `now` which", () => {
		it( "is a function", () => {
			Functions.now.should.be.Function();
		} );

		it( "returns number of seconds since Unix Epoch of current date/time", () => {
			Functions.now().should.be.Number().which.is.greaterThan( 0 );
		} );
	} );

	describe( "contains `parsedate` which", () => {
		it( "is a function", () => {
			Functions.parsedate.should.be.Function();
		} );

		it( "returns number of seconds since Unix Epoch of current time when omitting argument", () => {
			const a = Functions.parsedate();
			const b = Date.now() / 1000;

			a.should.be.Number().which.is.greaterThan( 0 );
			b.should.be.Number().which.is.greaterThan( 0 );

			( b - a ).should.be.greaterThanOrEqual( 0 ).and.lessThan( 1 );
		} );

		it( "returns number of seconds since Unix Epoch of current time when providing `undefined`", () => {
			const a = Functions.parsedate( undefined );
			const b = Date.now() / 1000;

			a.should.be.Number().which.is.greaterThan( 0 );
			b.should.be.Number().which.is.greaterThan( 0 );

			( b - a ).should.be.greaterThanOrEqual( 0 ).and.lessThan( 1 );
		} );

		it( "returns number of seconds since Unix Epoch of current time when providing `null`", () => {
			const a = Functions.parsedate( null );
			const b = Date.now() / 1000;

			a.should.be.Number().which.is.greaterThan( 0 );
			b.should.be.Number().which.is.greaterThan( 0 );

			( b - a ).should.be.greaterThanOrEqual( 0 ).and.lessThan( 1 );
		} );

		it( "returns number of seconds since Unix Epoch for provided instance of `Date`", () => {
			Functions.parsedate( new Date( "1970-01-01 00:00:00 UTC" ) ).should.be.Number().which.is.equal( 0 );

			const a = Functions.parsedate( new Date( "2019-01-01" ) );
			const b = Functions.parsedate( new Date( "2019-01-02" ) );

			a.should.be.Number().which.is.greaterThan( 0 );
			b.should.be.Number().which.is.greaterThan( 0 );

			( b - a ).should.be.equal( 86400 );
		} );

		it( "returns number of seconds since Unix Epoch for provided string describing date/time", () => {
			Functions.parsedate( "1970-01-01 00:00:00 UTC" ).should.be.Number().which.is.equal( 0 );

			const a = Functions.parsedate( "2019-01-01" );
			const b = Functions.parsedate( "2019-01-02" );

			a.should.be.Number().which.is.greaterThan( 0 );
			b.should.be.Number().which.is.greaterThan( 0 );

			( b - a ).should.be.equal( 86400 );
		} );

		it( "passes number of seconds since Unix Epoch provided as number", () => {
			Functions.parsedate( 0 ).should.be.Number().which.is.equal( 0 );
			Functions.parsedate( "0" ).should.be.Number().which.is.equal( 0 );

			const a = Functions.parsedate( Math.round( new Date( "2019-01-01" ).getTime() / 1000 ) );
			const b = Functions.parsedate( Math.round( new Date( "2019-01-02" ).getTime() / 1000 ) );

			a.should.be.Number().which.is.greaterThan( 0 );
			b.should.be.Number().which.is.greaterThan( 0 );

			( b - a ).should.be.equal( 86400 );
		} );
	} );

	describe( "contains `describedate` which", () => {
		it( "is a function", () => {
			Functions.describedate.should.be.Function();
		} );

		it( "returns object describing properties of current date/time when omitting argument", () => {
			const a = Functions.describedate();
			const now = new Date();

			a.should.be.an.Object();
			a.should.have.ownProperty( "year" ).which.is.a.Number().and.equal( now.getFullYear() );
			a.should.have.ownProperty( "month" ).which.is.a.Number().and.equal( now.getMonth() + 1 );
			a.should.have.ownProperty( "day" ).which.is.a.Number().and.equal( now.getDate() );
			a.should.have.ownProperty( "hour" ).which.is.a.Number().and.greaterThanOrEqual( 0 );
			a.should.have.ownProperty( "minute" ).which.is.a.Number().and.greaterThanOrEqual( 0 );
			a.should.have.ownProperty( "second" ).which.is.a.Number().and.greaterThanOrEqual( 0 );
			a.should.have.ownProperty( "dow" ).which.is.a.Number().and.equal( now.getDay() );
		} );

		it( "returns object describing properties of current date/time when providing `undefined`", () => {
			const a = Functions.describedate( undefined );
			const now = new Date();

			a.should.be.an.Object();
			a.should.have.ownProperty( "year" ).which.is.a.Number().and.equal( now.getFullYear() );
			a.should.have.ownProperty( "month" ).which.is.a.Number().and.equal( now.getMonth() + 1 );
			a.should.have.ownProperty( "day" ).which.is.a.Number().and.equal( now.getDate() );
			a.should.have.ownProperty( "hour" ).which.is.a.Number().and.greaterThanOrEqual( 0 );
			a.should.have.ownProperty( "minute" ).which.is.a.Number().and.greaterThanOrEqual( 0 );
			a.should.have.ownProperty( "second" ).which.is.a.Number().and.greaterThanOrEqual( 0 );
			a.should.have.ownProperty( "dow" ).which.is.a.Number().and.equal( now.getDay() );
		} );

		it( "returns object describing properties of current date/time when providing `null`", () => {
			const a = Functions.describedate( null );
			const now = new Date();

			a.should.be.an.Object();
			a.should.have.ownProperty( "year" ).which.is.a.Number().and.equal( now.getFullYear() );
			a.should.have.ownProperty( "month" ).which.is.a.Number().and.equal( now.getMonth() + 1 );
			a.should.have.ownProperty( "day" ).which.is.a.Number().and.equal( now.getDate() );
			a.should.have.ownProperty( "hour" ).which.is.a.Number().and.greaterThanOrEqual( 0 );
			a.should.have.ownProperty( "minute" ).which.is.a.Number().and.greaterThanOrEqual( 0 );
			a.should.have.ownProperty( "second" ).which.is.a.Number().and.greaterThanOrEqual( 0 );
			a.should.have.ownProperty( "dow" ).which.is.a.Number().and.equal( now.getDay() );
		} );

		it( "returns object describing properties of provided instance of Date", () => {
			const a = Functions.describedate( new Date( "2019-02-01 03:04:06" ) );

			a.should.be.an.Object();
			a.should.have.ownProperty( "year" ).which.is.a.Number().and.equal( 2019 );
			a.should.have.ownProperty( "month" ).which.is.a.Number().and.equal( 2 );
			a.should.have.ownProperty( "day" ).which.is.a.Number().and.equal( 1 );
			a.should.have.ownProperty( "hour" ).which.is.a.Number().and.equal( 3 );
			a.should.have.ownProperty( "minute" ).which.is.a.Number().and.equal( 4 );
			a.should.have.ownProperty( "second" ).which.is.a.Number().and.equal( 6 );
			a.should.have.ownProperty( "dow" ).which.is.a.Number().and.equal( 5 ); // 5 = friday
		} );

		it( "returns object describing properties of date/time given as string", () => {
			const a = Functions.describedate( "2019-02-01 03:04:06" );

			a.should.be.an.Object();
			a.should.have.ownProperty( "year" ).which.is.a.Number().and.equal( 2019 );
			a.should.have.ownProperty( "month" ).which.is.a.Number().and.equal( 2 );
			a.should.have.ownProperty( "day" ).which.is.a.Number().and.equal( 1 );
			a.should.have.ownProperty( "hour" ).which.is.a.Number().and.equal( 3 );
			a.should.have.ownProperty( "minute" ).which.is.a.Number().and.equal( 4 );
			a.should.have.ownProperty( "second" ).which.is.a.Number().and.equal( 6 );
			a.should.have.ownProperty( "dow" ).which.is.a.Number().and.equal( 5 ); // 5 = friday
		} );
	} );

	describe( "contains `formatdate` which", () => {
		it( "is a function", () => {
			Functions.formatdate.should.be.Function();
		} );

		it( "returns string representing some described date/time", () => {
			Functions.formatdate( "d.m.y", new Date( "2019-01-01" ) ).should.be.String().which.is.equal( "01.01.2019" );
			Functions.formatdate( "d.m.y", new Date( "2019-12-31" ) ).should.be.String().which.is.equal( "31.12.2019" );
			Functions.formatdate( "D.M.Y", new Date( "2019-01-01" ) ).should.be.String().which.is.equal( "01.01.2019" );
			Functions.formatdate( "D.M.Y", new Date( "2019-12-31" ) ).should.be.String().which.is.equal( "31.12.2019" );
			Functions.formatdate( "y-m-d", new Date( "2019-01-01" ) ).should.be.String().which.is.equal( "2019-01-01" );
			Functions.formatdate( "y-m-d", new Date( "2019-12-31" ) ).should.be.String().which.is.equal( "2019-12-31" );
			Functions.formatdate( "j.n.y", new Date( "2019-01-01" ) ).should.be.String().which.is.equal( "1.1.2019" );
			Functions.formatdate( "j.n.y", new Date( "2019-12-31" ) ).should.be.String().which.is.equal( "31.12.2019" );
			Functions.formatdate( "J.N.Y", new Date( "2019-01-01" ) ).should.be.String().which.is.equal( "1.1.2019" );
			Functions.formatdate( "J.N.Y", new Date( "2019-12-31" ) ).should.be.String().which.is.equal( "31.12.2019" );

			Functions.formatdate( "\\y-\\m-\\d", new Date( "2019-12-31" ) ).should.be.String().which.is.equal( "y-m-d" );
			Functions.formatdate( "\\j.\\n.\\y", new Date( "2019-12-31" ) ).should.be.String().which.is.equal( "j.n.y" );
			Functions.formatdate( "\\Y-\\M-\\D", new Date( "2019-12-31" ) ).should.be.String().which.is.equal( "Y-M-D" );
			Functions.formatdate( "\\J.\\N.\\Y", new Date( "2019-12-31" ) ).should.be.String().which.is.equal( "J.N.Y" );

			Functions.formatdate( "h:i:s", new Date( "2019-01-01 00:00:00" ) ).should.be.String().which.is.equal( "00:00:00" );
			Functions.formatdate( "h:i:s", new Date( "2019-01-01 23:59:59" ) ).should.be.String().which.is.equal( "23:59:59" );
			Functions.formatdate( "h:i:s", new Date( "2019-01-01 09:09:09" ) ).should.be.String().which.is.equal( "09:09:09" );
			Functions.formatdate( "g:i:s", new Date( "2019-01-01 00:00:00" ) ).should.be.String().which.is.equal( "0:00:00" );
			Functions.formatdate( "g:i:s", new Date( "2019-01-01 23:59:59" ) ).should.be.String().which.is.equal( "23:59:59" );
			Functions.formatdate( "g:i:s", new Date( "2019-01-01 09:09:09" ) ).should.be.String().which.is.equal( "9:09:09" );

			Functions.formatdate( "\\h:\\i:\\s", new Date( "2019-01-01 09:09:09" ) ).should.be.String().which.is.equal( "h:i:s" );
			Functions.formatdate( "\\H:\\I:\\S", new Date( "2019-01-01 09:09:09" ) ).should.be.String().which.is.equal( "H:I:S" );
			Functions.formatdate( "\\g:\\i:\\s", new Date( "2019-01-01 09:09:09" ) ).should.be.String().which.is.equal( "g:i:s" );
			Functions.formatdate( "\\G:\\I:\\S", new Date( "2019-01-01 09:09:09" ) ).should.be.String().which.is.equal( "G:I:S" );

			Functions.formatdate( "y-m-dTh:i:s", new Date( "2019-01-01 00:00:00" ) ).should.be.String().which.is.equal( "2019-01-01T00:00:00" );
			Functions.formatdate( "y-m-dTh:i:s", new Date( "2019-12-31 00:00:00" ) ).should.be.String().which.is.equal( "2019-12-31T00:00:00" );
		} );
	} );

	describe( "contains `droptime` which", () => {
		it( "is a function", () => {
			Functions.droptime.should.be.Function();
		} );

		it( "returns seconds since Unix Epoch of midnight starting day in a given timestamp", () => {
			const ts = Functions.parsedate( "2015-09-01 12:34:56" );

			const raw = Functions.describedate( ts );
			raw.hour.should.be.Number().which.is.equal( 12 );
			raw.minute.should.be.Number().which.is.equal( 34 );
			raw.second.should.be.Number().which.is.equal( 56 );

			const trimmed = Functions.describedate( Functions.droptime( ts ) );
			trimmed.hour.should.be.Number().which.is.equal( 0 );
			trimmed.minute.should.be.Number().which.is.equal( 0 );
			trimmed.second.should.be.Number().which.is.equal( 0 );
		} );
	} );

	describe( "contains `dateadd` which", () => {
		it( "is a function", () => {
			Functions.dateadd.should.be.Function();
		} );

		it( "returns seconds since Unix Epoch of timestamp resulting from adjusting some provided timestamp", () => {
			const ts = Functions.parsedate( "2019-09-01 12:34:56" );

			const raw = Functions.describedate( ts );
			raw.year.should.be.Number().which.is.equal( 2019 );
			raw.month.should.be.Number().which.is.equal( 9 );
			raw.day.should.be.Number().which.is.equal( 1 );
			raw.hour.should.be.Number().which.is.equal( 12 );
			raw.minute.should.be.Number().which.is.equal( 34 );
			raw.second.should.be.Number().which.is.equal( 56 );

			let adjust = Functions.describedate( Functions.dateadd( ts, 1, "s" ) );
			adjust.year.should.be.Number().which.is.equal( 2019 );
			adjust.month.should.be.Number().which.is.equal( 9 );
			adjust.day.should.be.Number().which.is.equal( 1 );
			adjust.hour.should.be.Number().which.is.equal( 12 );
			adjust.minute.should.be.Number().which.is.equal( 34 );
			adjust.second.should.be.Number().which.is.equal( 57 );

			adjust = Functions.describedate( Functions.dateadd( ts, -1, "s" ) );
			adjust.year.should.be.Number().which.is.equal( 2019 );
			adjust.month.should.be.Number().which.is.equal( 9 );
			adjust.day.should.be.Number().which.is.equal( 1 );
			adjust.hour.should.be.Number().which.is.equal( 12 );
			adjust.minute.should.be.Number().which.is.equal( 34 );
			adjust.second.should.be.Number().which.is.equal( 55 );

			adjust = Functions.describedate( Functions.dateadd( ts, 1, "i" ) );
			adjust.year.should.be.Number().which.is.equal( 2019 );
			adjust.month.should.be.Number().which.is.equal( 9 );
			adjust.day.should.be.Number().which.is.equal( 1 );
			adjust.hour.should.be.Number().which.is.equal( 12 );
			adjust.minute.should.be.Number().which.is.equal( 35 );
			adjust.second.should.be.Number().which.is.equal( 56 );

			adjust = Functions.describedate( Functions.dateadd( ts, -1, "i" ) );
			adjust.year.should.be.Number().which.is.equal( 2019 );
			adjust.month.should.be.Number().which.is.equal( 9 );
			adjust.day.should.be.Number().which.is.equal( 1 );
			adjust.hour.should.be.Number().which.is.equal( 12 );
			adjust.minute.should.be.Number().which.is.equal( 33 );
			adjust.second.should.be.Number().which.is.equal( 56 );

			adjust = Functions.describedate( Functions.dateadd( ts, 1, "h" ) );
			adjust.year.should.be.Number().which.is.equal( 2019 );
			adjust.month.should.be.Number().which.is.equal( 9 );
			adjust.day.should.be.Number().which.is.equal( 1 );
			adjust.hour.should.be.Number().which.is.equal( 13 );
			adjust.minute.should.be.Number().which.is.equal( 34 );
			adjust.second.should.be.Number().which.is.equal( 56 );

			adjust = Functions.describedate( Functions.dateadd( ts, -1, "h" ) );
			adjust.year.should.be.Number().which.is.equal( 2019 );
			adjust.month.should.be.Number().which.is.equal( 9 );
			adjust.day.should.be.Number().which.is.equal( 1 );
			adjust.hour.should.be.Number().which.is.equal( 11 );
			adjust.minute.should.be.Number().which.is.equal( 34 );
			adjust.second.should.be.Number().which.is.equal( 56 );

			adjust = Functions.describedate( Functions.dateadd( ts, 1, "d" ) );
			adjust.year.should.be.Number().which.is.equal( 2019 );
			adjust.month.should.be.Number().which.is.equal( 9 );
			adjust.day.should.be.Number().which.is.equal( 2 );
			adjust.hour.should.be.Number().which.is.equal( 12 );
			adjust.minute.should.be.Number().which.is.equal( 34 );
			adjust.second.should.be.Number().which.is.equal( 56 );

			adjust = Functions.describedate( Functions.dateadd( ts, -1, "d" ) );
			adjust.year.should.be.Number().which.is.equal( 2019 );
			adjust.month.should.be.Number().which.is.equal( 8 );
			adjust.day.should.be.Number().which.is.equal( 31 );
			adjust.hour.should.be.Number().which.is.equal( 12 );
			adjust.minute.should.be.Number().which.is.equal( 34 );
			adjust.second.should.be.Number().which.is.equal( 56 );

			adjust = Functions.describedate( Functions.dateadd( ts, 1, "w" ) );
			adjust.year.should.be.Number().which.is.equal( 2019 );
			adjust.month.should.be.Number().which.is.equal( 9 );
			adjust.day.should.be.Number().which.is.equal( 8 );
			adjust.hour.should.be.Number().which.is.equal( 12 );
			adjust.minute.should.be.Number().which.is.equal( 34 );
			adjust.second.should.be.Number().which.is.equal( 56 );

			adjust = Functions.describedate( Functions.dateadd( ts, -1, "w" ) );
			adjust.year.should.be.Number().which.is.equal( 2019 );
			adjust.month.should.be.Number().which.is.equal( 8 );
			adjust.day.should.be.Number().which.is.equal( 25 );
			adjust.hour.should.be.Number().which.is.equal( 12 );
			adjust.minute.should.be.Number().which.is.equal( 34 );
			adjust.second.should.be.Number().which.is.equal( 56 );

			adjust = Functions.describedate( Functions.dateadd( ts, 1, "m" ) );
			adjust.year.should.be.Number().which.is.equal( 2019 );
			adjust.month.should.be.Number().which.is.equal( 10 );
			adjust.day.should.be.Number().which.is.equal( 1 );
			adjust.hour.should.be.Number().which.is.equal( 12 );
			adjust.minute.should.be.Number().which.is.equal( 34 );
			adjust.second.should.be.Number().which.is.equal( 56 );

			adjust = Functions.describedate( Functions.dateadd( ts, -1, "m" ) );
			adjust.year.should.be.Number().which.is.equal( 2019 );
			adjust.month.should.be.Number().which.is.equal( 8 );
			adjust.day.should.be.Number().which.is.equal( 1 );
			adjust.hour.should.be.Number().which.is.equal( 12 );
			adjust.minute.should.be.Number().which.is.equal( 34 );
			adjust.second.should.be.Number().which.is.equal( 56 );

			adjust = Functions.describedate( Functions.dateadd( ts, 1, "y" ) );
			adjust.year.should.be.Number().which.is.equal( 2020 );
			adjust.month.should.be.Number().which.is.equal( 9 );
			adjust.day.should.be.Number().which.is.equal( 1 );
			adjust.hour.should.be.Number().which.is.equal( 12 );
			adjust.minute.should.be.Number().which.is.equal( 34 );
			adjust.second.should.be.Number().which.is.equal( 56 );

			adjust = Functions.describedate( Functions.dateadd( ts, -1, "y" ) );
			adjust.year.should.be.Number().which.is.equal( 2018 );
			adjust.month.should.be.Number().which.is.equal( 9 );
			adjust.day.should.be.Number().which.is.equal( 1 );
			adjust.hour.should.be.Number().which.is.equal( 12 );
			adjust.minute.should.be.Number().which.is.equal( 34 );
			adjust.second.should.be.Number().which.is.equal( 56 );
		} );
	} );

	describe( "contains `datediff` which", () => {
		it( "is a function", () => {
			Functions.datediff.should.be.Function();
		} );

		it( "returns number of seconds between two dates", () => {
			[
				[ "2019-01-02", "2019-01-01", 86400 ],
				[ "2019-01-01 00:00:01", "2019-01-01 00:00:00", 1 ],
			]
				.forEach( ( [ testee, reference, result ] ) => {
					Functions.datediff( testee, reference ).should.be.Number().which.is.equal( result );
					Functions.datediff( new Date( testee ), new Date( reference ) ).should.be.Number().which.is.equal( result );
				} );
		} );

		it( "returns negative number of seconds between two dates when reference in 2nd argument is past tested one in 1st argument", () => {
			[
				[ "2019-01-01", "2019-01-02", -86400 ],
				[ "2019-01-01 00:00:00", "2019-01-01 00:00:01", -1 ],
			]
				.forEach( ( [ testee, reference, result ] ) => {
					Functions.datediff( testee, reference ).should.be.Number().which.is.equal( result );
					Functions.datediff( new Date( testee ), new Date( reference ) ).should.be.Number().which.is.equal( result );
				} );
		} );

		it( "returns absolute number of seconds between two dates when reference in 2nd argument is past tested one in 1st argument on demand", () => {
			[
				[ "2019-01-01", "2019-01-02", 86400 ],
				[ "2019-01-01 00:00:00", "2019-01-01 00:00:01", 1 ],
			]
				.forEach( ( [ testee, reference, result ] ) => {
					Functions.datediff( testee, reference, null, true ).should.be.Number().which.is.equal( result );
					Functions.datediff( testee, reference, "s", true ).should.be.Number().which.is.equal( result );
					Functions.datediff( new Date( testee ), new Date( reference ), null, true ).should.be.Number().which.is.equal( result );
					Functions.datediff( new Date( testee ), new Date( reference ), "s", true ).should.be.Number().which.is.equal( result );
				} );
		} );

		it( "returns number of minutes between two dates on demand", () => {
			const unit = "i";

			[
				[ "2019-01-02", "2019-01-01", 1440 ],
				[ "2019-01-01 00:01:00", "2019-01-01 00:00:00", 1 ],
				[ "2019-01-01 00:01:00", "2019-01-01 00:00:30", 0.5 ],
			]
				.forEach( ( [ testee, reference, result ] ) => {
					Functions.datediff( testee, reference, unit ).should.be.Number().which.is.equal( result );
					Functions.datediff( new Date( testee ), new Date( reference ), unit ).should.be.Number().which.is.equal( result );

					Functions.datediff( reference, testee, unit ).should.be.Number().which.is.equal( -result );
					Functions.datediff( new Date( reference ), new Date( testee ), unit ).should.be.Number().which.is.equal( -result );

					Functions.datediff( reference, testee, unit, true ).should.be.Number().which.is.equal( result );
					Functions.datediff( new Date( reference ), new Date( testee ), unit, true ).should.be.Number().which.is.equal( result );
				} );
		} );

		it( "returns number of hours between two dates on demand", () => {
			const unit = "h";

			[
				[ "2019-01-02", "2019-01-01", 24 ],
				[ "2019-01-01 01:00:00", "2019-01-01 00:00:00", 1 ],
				[ "2019-01-01 01:00:00", "2019-01-01 00:30:00", 0.5 ],
			]
				.forEach( ( [ testee, reference, result ] ) => {
					Functions.datediff( testee, reference, unit ).should.be.Number().which.is.equal( result );
					Functions.datediff( new Date( testee ), new Date( reference ), unit ).should.be.Number().which.is.equal( result );

					Functions.datediff( reference, testee, unit ).should.be.Number().which.is.equal( -result );
					Functions.datediff( new Date( reference ), new Date( testee ), unit ).should.be.Number().which.is.equal( -result );

					Functions.datediff( reference, testee, unit, true ).should.be.Number().which.is.equal( result );
					Functions.datediff( new Date( reference ), new Date( testee ), unit, true ).should.be.Number().which.is.equal( result );
				} );
		} );

		it( "returns number of days between two dates on demand", () => {
			const unit = "d";

			[
				[ "2019-01-02", "2019-01-01", 1 ],
				[ "2019-02-01", "2019-01-01", 31 ],
				[ "2019-01-02 12:00:00", "2019-01-01 12:00:00", 1 ],
				[ "2019-01-02 00:00:00", "2019-01-01 12:00:00", 0.5 ],
				[ "2019-01-02 12:00:00", "2019-01-02 00:00:00", 0.5 ],
			]
				.forEach( ( [ testee, reference, result ] ) => {
					Functions.datediff( testee, reference, unit ).should.be.Number().which.is.equal( result );
					Functions.datediff( new Date( testee ), new Date( reference ), unit ).should.be.Number().which.is.equal( result );

					Functions.datediff( reference, testee, unit ).should.be.Number().which.is.equal( -result );
					Functions.datediff( new Date( reference ), new Date( testee ), unit ).should.be.Number().which.is.equal( -result );

					Functions.datediff( reference, testee, unit, true ).should.be.Number().which.is.equal( result );
					Functions.datediff( new Date( reference ), new Date( testee ), unit, true ).should.be.Number().which.is.equal( result );
				} );
		} );

		it( "returns number of days between two dates on demand", () => {
			const unit = "w";

			[
				[ "2019-01-08", "2019-01-01", 1 ],
				[ "2019-01-29", "2019-01-01", 4 ],
				[ "2019-01-08 12:00:00", "2019-01-01 12:00:00", 1 ],
				[ "2019-01-05 00:00:00", "2019-01-01 12:00:00", 0.5 ],
				[ "2019-01-08 12:00:00", "2019-01-05 00:00:00", 0.5 ],
			]
				.forEach( ( [ testee, reference, result ] ) => {
					Functions.datediff( testee, reference, unit ).should.be.Number().which.is.equal( result );
					Functions.datediff( new Date( testee ), new Date( reference ), unit ).should.be.Number().which.is.equal( result );

					Functions.datediff( reference, testee, unit ).should.be.Number().which.is.equal( -result );
					Functions.datediff( new Date( reference ), new Date( testee ), unit ).should.be.Number().which.is.equal( -result );

					Functions.datediff( reference, testee, unit, true ).should.be.Number().which.is.equal( result );
					Functions.datediff( new Date( reference ), new Date( testee ), unit, true ).should.be.Number().which.is.equal( result );
				} );
		} );

		it( "returns (nonlinear) number of months between two dates on demand", () => {
			const unit = "nm";

			[
				[ "2021-02-01", "2019-02-01", 24 ],
				[ "2019-02-01", "2019-01-01", 1 ],
				[ "2019-03-01", "2019-02-01", 1 ],
				[ "2019-02-15", "2019-02-01", 0.5 ],
				[ "2019-03-15", "2019-02-15", 1 ],
				[ "2019-03-01", "2019-02-15", 0.5 ],
				[ "2019-03-31", "2019-02-28", 1 ],  // odd but desired result in non-linear calculations
				[ "2020-02-29", "2019-02-28", 12 ], // odd but desired result in non-linear calculations
				[ "2019-08-08 12:00:00", "2019-07-08 12:00:00", 1 ],
			]
				.forEach( ( [ testee, reference, result ] ) => {
					Functions.datediff( testee, reference, unit ).should.be.Number().which.is.equal( result );
					Functions.datediff( new Date( testee ), new Date( reference ), unit ).should.be.Number().which.is.equal( result );

					Functions.datediff( reference, testee, unit ).should.be.Number().which.is.equal( -result );
					Functions.datediff( new Date( reference ), new Date( testee ), unit ).should.be.Number().which.is.equal( -result );

					Functions.datediff( reference, testee, unit, true ).should.be.Number().which.is.equal( result );
					Functions.datediff( new Date( reference ), new Date( testee ), unit, true ).should.be.Number().which.is.equal( result );
				} );
		} );

		it( "returns (linear) number of months between two dates on demand", () => {
			const unit = "m";

			[
				[ "2021-02-01", "2019-02-01", 24 ],
				[ "2019-02-01", "2019-01-01", 1 ],
				[ "2019-03-01", "2019-02-01", 1 ],
				[ "2019-02-15", "2019-02-01", 0.5 ],
				[ "2019-03-01", "2019-02-15", 0.5 ],
				[ "2019-03-16 12:00:00", "2019-03-01", 0.5 ],
				[ "2019-08-08 12:00:00", "2019-07-08 12:00:00", 1 ],
			]
				.forEach( ( [ testee, reference, result ] ) => {
					Functions.datediff( testee, reference, unit ).should.be.Number().which.is.equal( result );
					Functions.datediff( new Date( testee ), new Date( reference ), unit ).should.be.Number().which.is.equal( result );

					Functions.datediff( reference, testee, unit ).should.be.Number().which.is.equal( -result );
					Functions.datediff( new Date( reference ), new Date( testee ), unit ).should.be.Number().which.is.equal( -result );

					Functions.datediff( reference, testee, unit, true ).should.be.Number().which.is.equal( result );
					Functions.datediff( new Date( reference ), new Date( testee ), unit, true ).should.be.Number().which.is.equal( result );
				} );
		} );

		it( "returns (nonlinear) number of years between two dates on demand", () => {
			const unit = "ny";

			[
				[ "2021-02-01", "2019-02-01", 2 ],
				[ "2019-07-01", "2019-01-01", 0.5 ],
				[ "2020-02-28", "2019-02-27", 1.003 ],
				[ "2020-02-28", "2019-02-28", 1 ], // odd but desired result in non-linear calculations
				[ "2020-02-29", "2019-02-28", 1 ], // odd but desired result in non-linear calculations
				[ "2020-07-08 12:00:00", "2019-07-08 12:00:00", 1 ],
			]
				.forEach( ( [ testee, reference, result ] ) => {
					Functions.datediff( testee, reference, unit ).should.be.Number().which.is.equal( result );
					Functions.datediff( new Date( testee ), new Date( reference ), unit ).should.be.Number().which.is.equal( result );

					Functions.datediff( reference, testee, unit ).should.be.Number().which.is.equal( -result );
					Functions.datediff( new Date( reference ), new Date( testee ), unit ).should.be.Number().which.is.equal( -result );

					Functions.datediff( reference, testee, unit, true ).should.be.Number().which.is.equal( result );
					Functions.datediff( new Date( reference ), new Date( testee ), unit, true ).should.be.Number().which.is.equal( result );
				} );
		} );

		it( "returns (linear) number of years between two dates on demand", () => {
			const unit = "y";

			[
				[ "2021-02-01", "2019-02-01", 2 ],
				[ "2019-07-01", "2019-01-01", 0.5 ],
				[ "2020-02-28", "2019-02-27", 1 ], // matches due to rounding
				[ "2019-02-28 00:00:00", "2018-02-28 00:00:00", 1 ],
				[ "2020-02-28 00:00:00", "2019-02-28 00:00:00", 0.997 ],
				[ "2020-03-01 00:00:00", "2019-03-01 00:00:00", 1 ], // matches due to rounding
				[ "2020-07-08 12:00:00", "2019-07-08 12:00:00", 1 ], // matches due to rounding
			]
				.forEach( ( [ testee, reference, result ] ) => {
					Functions.datediff( testee, reference, unit ).should.be.Number().which.is.equal( result );
					Functions.datediff( new Date( testee ), new Date( reference ), unit ).should.be.Number().which.is.equal( result );

					Functions.datediff( reference, testee, unit ).should.be.Number().which.is.equal( -result );
					Functions.datediff( new Date( reference ), new Date( testee ), unit ).should.be.Number().which.is.equal( -result );

					Functions.datediff( reference, testee, unit, true ).should.be.Number().which.is.equal( result );
					Functions.datediff( new Date( reference ), new Date( testee ), unit, true ).should.be.Number().which.is.equal( result );
				} );
		} );
	} );

	describe( "contains `random` which", () => {
		it( "is a function", () => {
			Functions.random.should.be.Function();
		} );

		it( "returns random positive integer in interval [0,1000[ by default", () => {
			for ( let i = 0; i < 1000; i++ ) {
				Functions.random().should.be.Number().which.is.greaterThanOrEqual( 0 ).and.is.lessThan( 1000 );
			}
		} );

		it( "returns random integer in selected range", () => {
			for ( let i = 0; i < 1000; i++ ) {
				Functions.random( 59, 70 ).should.be.Number().which.is.greaterThanOrEqual( 59 ).and.lessThanOrEqual( 70 );
			}
		} );

		it( "returns random negative integer in selected range", () => {
			for ( let i = 0; i < 1000; i++ ) {
				Functions.random( -70, -59 ).should.be.Number().which.is.greaterThanOrEqual( -70 ).and.lessThanOrEqual( -59 );
			}
		} );

		it( "returns random negative/positive integer in selected range", () => {
			for ( let i = 0; i < 1000; i++ ) {
				Functions.random( -13, 13 ).should.be.Number().which.is.greaterThanOrEqual( -13 ).and.lessThanOrEqual( 13 );
			}
		} );
	} );

	describe( "contains `leftpad` which", () => {
		it( "is a function", () => {
			Functions.leftpad.should.be.Function();
		} );

		it( "returns string", () => {
			Functions.leftpad( "", 10 ).should.be.String().which.is.equal( "          " );
			Functions.leftpad( "test", 10 ).should.be.String().which.is.equal( "      test" );
			Functions.leftpad( "", 10, "0" ).should.be.String().which.is.equal( "0000000000" );
			Functions.leftpad( "test", 10, "0" ).should.be.String().which.is.equal( "000000test" );
			Functions.leftpad( "some::test", 10 ).should.be.String().which.is.equal( "some::test" );
			Functions.leftpad( "some::test", 10, "0" ).should.be.String().which.is.equal( "some::test" );
			Functions.leftpad( "some:text:test", 10 ).should.be.String().which.is.equal( "some:text:test" );
			Functions.leftpad( "some:text:test", 10, "0" ).should.be.String().which.is.equal( "some:text:test" );
		} );
	} );

	describe( "contains `rightpad` which", () => {
		it( "is a function", () => {
			Functions.rightpad.should.be.Function();
		} );

		it( "returns string", () => {
			Functions.rightpad( "", 10 ).should.be.String().which.is.equal( "          " );
			Functions.rightpad( "test", 10 ).should.be.String().which.is.equal( "test      " );
			Functions.rightpad( "", 10, "0" ).should.be.String().which.is.equal( "0000000000" );
			Functions.rightpad( "test", 10, "0" ).should.be.String().which.is.equal( "test000000" );
			Functions.rightpad( "some::test", 10 ).should.be.String().which.is.equal( "some::test" );
			Functions.rightpad( "some::test", 10, "0" ).should.be.String().which.is.equal( "some::test" );
			Functions.rightpad( "some:text:test", 10 ).should.be.String().which.is.equal( "some:text:test" );
			Functions.rightpad( "some:text:test", 10, "0" ).should.be.String().which.is.equal( "some:text:test" );
		} );
	} );

	describe( "contains `centerpad` which", () => {
		it( "is a function", () => {
			Functions.centerpad.should.be.Function();
		} );

		it( "returns string", () => {
			Functions.centerpad( "", 10 ).should.be.String().which.is.equal( "          " );
			Functions.centerpad( "test", 10 ).should.be.String().which.is.equal( "   test   " );
			Functions.centerpad( "test", 9 ).should.be.String().which.is.equal( "  test   " );
			Functions.centerpad( "", 10, "0" ).should.be.String().which.is.equal( "0000000000" );
			Functions.centerpad( "test", 10, "0" ).should.be.String().which.is.equal( "000test000" );
			Functions.centerpad( "test", 9, "0" ).should.be.String().which.is.equal( "00test000" );
			Functions.centerpad( "some::test", 10 ).should.be.String().which.is.equal( "some::test" );
			Functions.centerpad( "some::test", 10, "0" ).should.be.String().which.is.equal( "some::test" );
			Functions.centerpad( "some:text:test", 10 ).should.be.String().which.is.equal( "some:text:test" );
			Functions.centerpad( "some:text:test", 10, "0" ).should.be.String().which.is.equal( "some:text:test" );
		} );
	} );

	describe( "contains `cookie` which", () => {
		before( () => {
			global.document = { cookie: "someName=someValue;furtherName=furtherValue;lastName=lastValue" };
		} );

		it( "is a function", () => {
			Functions.cookie.should.be.Function();
		} );

		it( "returns value of cookie selected by its name", () => {
			Functions.cookie( "someName" ).should.have.String().which.is.equal( "someValue" );
			Functions.cookie( "furtherName" ).should.have.String().which.is.equal( "furtherValue" );
			Functions.cookie( "lastName" ).should.have.String().which.is.equal( "lastValue" );
		} );
	} );

	describe( "contains `ceil` which", () => {
		it( "is a function", () => {
			Functions.ceil.should.be.Function();
		} );

		it( "returns provided value rounded up to next integer", () => {
			Functions.ceil( 45.834 ).should.be.Number().which.is.equal( 46 );
			Functions.ceil( 45.123 ).should.be.Number().which.is.equal( 46 );
			Functions.ceil( 45.0000000000001 ).should.be.Number().which.is.equal( 46 );
			Functions.ceil( "10.0000000000001" ).should.be.Number().which.is.equal( 11 );
		} );

		it( "returns provided value rounded the nearest smaller integer on negative values", () => {
			Functions.ceil( -45.802 ).should.be.Number().which.is.equal( -46 );
			Functions.ceil( -45.123 ).should.be.Number().which.is.equal( -46 );
			Functions.ceil( -45.0000000000001 ).should.be.Number().which.is.equal( -46 );
			Functions.ceil( "-10.0000000000001" ).should.be.Number().which.is.equal( -11 );
		} );

		it( "accepts precision in second argument", () => {
			Functions.ceil( 45.834, 1 ).should.be.Number().which.is.equal( 45.9 );
			Functions.ceil( 45.834, 2 ).should.be.Number().which.is.equal( 45.84 );
			Functions.ceil( 45.834, -1 ).should.be.Number().which.is.equal( 50 );
			Functions.ceil( 45.834, -2 ).should.be.Number().which.is.equal( 100 );
			Functions.ceil( 45.123, 1 ).should.be.Number().which.is.equal( 45.2 );
			Functions.ceil( 45.123, 2 ).should.be.Number().which.is.equal( 45.13 );
			Functions.ceil( 45.123, -1 ).should.be.Number().which.is.equal( 50 );
			Functions.ceil( 45.123, -2 ).should.be.Number().which.is.equal( 100 );
			Functions.ceil( 45.0000000000001 ).should.be.Number().which.is.equal( 46 );
			Functions.ceil( 45.0000000000001, 1 ).should.be.Number().which.is.equal( 45.1 );
			Functions.ceil( 45.0000000000001, 2 ).should.be.Number().which.is.equal( 45.01 );
			Functions.ceil( 45.0000000000001, -1 ).should.be.Number().which.is.equal( 50 );
			Functions.ceil( 45.0000000000001, -2 ).should.be.Number().which.is.equal( 100 );
			Functions.ceil( "10.0000000000001" ).should.be.Number().which.is.equal( 11 );
			Functions.ceil( "10.0000000000001", 1 ).should.be.Number().which.is.equal( 10.1 );
			Functions.ceil( "10.0000000000001", 2 ).should.be.Number().which.is.equal( 10.01 );
			Functions.ceil( "10.0000000000001", -1 ).should.be.Number().which.is.equal( 20 );
			Functions.ceil( "10.0000000000001", -2 ).should.be.Number().which.is.equal( 100 );

			Functions.ceil( -45.834, 1 ).should.be.Number().which.is.equal( -45.9 );
			Functions.ceil( -45.834, 2 ).should.be.Number().which.is.equal( -45.84 );
			Functions.ceil( -45.834, -1 ).should.be.Number().which.is.equal( -50 );
			Functions.ceil( -45.834, -2 ).should.be.Number().which.is.equal( -100 );
			Functions.ceil( -45.123, 1 ).should.be.Number().which.is.equal( -45.2 );
			Functions.ceil( -45.123, 2 ).should.be.Number().which.is.equal( -45.13 );
			Functions.ceil( -45.123, -1 ).should.be.Number().which.is.equal( -50 );
			Functions.ceil( -45.123, -2 ).should.be.Number().which.is.equal( -100 );
			Functions.ceil( -45.0000000000001 ).should.be.Number().which.is.equal( -46 );
			Functions.ceil( -45.0000000000001, 1 ).should.be.Number().which.is.equal( -45.1 );
			Functions.ceil( -45.0000000000001, 2 ).should.be.Number().which.is.equal( -45.01 );
			Functions.ceil( -45.0000000000001, -1 ).should.be.Number().which.is.equal( -50 );
			Functions.ceil( -45.0000000000001, -2 ).should.be.Number().which.is.equal( -100 );
			Functions.ceil( "-10.0000000000001" ).should.be.Number().which.is.equal( -11 );
			Functions.ceil( "-10.0000000000001", 1 ).should.be.Number().which.is.equal( -10.1 );
			Functions.ceil( "-10.0000000000001", 2 ).should.be.Number().which.is.equal( -10.01 );
			Functions.ceil( "-10.0000000000001", -1 ).should.be.Number().which.is.equal( -20 );
			Functions.ceil( "-10.0000000000001", -2 ).should.be.Number().which.is.equal( -100 );
		} );
	} );

	describe( "contains `floor` which", () => {
		it( "is a function", () => {
			Functions.floor.should.be.Function();
		} );

		it( "returns provided value rounded up to next integer", () => {
			Functions.floor( 45.834 ).should.be.Number().which.is.equal( 45 );
			Functions.floor( 45.123 ).should.be.Number().which.is.equal( 45 );
			Functions.floor( 45.0000000000001 ).should.be.Number().which.is.equal( 45 );
			Functions.floor( "10.0000000000001" ).should.be.Number().which.is.equal( 10 );
		} );

		it( "returns provided value rounded the nearest smaller integer on negative values", () => {
			Functions.floor( -45.802 ).should.be.Number().which.is.equal( -45 );
			Functions.floor( -45.123 ).should.be.Number().which.is.equal( -45 );
			Functions.floor( -45.0000000000001 ).should.be.Number().which.is.equal( -45 );
			Functions.floor( "-10.0000000000001" ).should.be.Number().which.is.equal( -10 );
		} );

		it( "accepts precision in second argument", () => {
			Functions.floor( 45.834, 1 ).should.be.Number().which.is.equal( 45.8 );
			Functions.floor( 45.834, 2 ).should.be.Number().which.is.equal( 45.83 );
			Functions.floor( 45.834, -1 ).should.be.Number().which.is.equal( 40 );
			Functions.floor( 45.834, -2 ).should.be.Number().which.is.equal( 0 );
			Functions.floor( 45.123, 1 ).should.be.Number().which.is.equal( 45.1 );
			Functions.floor( 45.123, 2 ).should.be.Number().which.is.equal( 45.12 );
			Functions.floor( 45.123, -1 ).should.be.Number().which.is.equal( 40 );
			Functions.floor( 45.123, -2 ).should.be.Number().which.is.equal( 0 );
			Functions.floor( 45.0000000000001 ).should.be.Number().which.is.equal( 45 );
			Functions.floor( 45.0000000000001, 1 ).should.be.Number().which.is.equal( 45 );
			Functions.floor( 45.0000000000001, 2 ).should.be.Number().which.is.equal( 45 );
			Functions.floor( 45.0000000000001, -1 ).should.be.Number().which.is.equal( 40 );
			Functions.floor( 45.0000000000001, -2 ).should.be.Number().which.is.equal( 0 );
			Functions.floor( "10.0000000000001" ).should.be.Number().which.is.equal( 10 );
			Functions.floor( "10.0000000000001", 1 ).should.be.Number().which.is.equal( 10 );
			Functions.floor( "10.0000000000001", 2 ).should.be.Number().which.is.equal( 10 );
			Functions.floor( "10.0000000000001", -1 ).should.be.Number().which.is.equal( 10 );
			Functions.floor( "10.0000000000001", -2 ).should.be.Number().which.is.equal( 0 );

			Functions.floor( -45.834, 1 ).should.be.Number().which.is.equal( -45.8 );
			Functions.floor( -45.834, 2 ).should.be.Number().which.is.equal( -45.83 );
			Functions.floor( -45.834, -1 ).should.be.Number().which.is.equal( -40 );
			Functions.floor( -45.834, -2 ).should.be.Number().which.is.equal( -0 );
			Functions.floor( -45.123, 1 ).should.be.Number().which.is.equal( -45.1 );
			Functions.floor( -45.123, 2 ).should.be.Number().which.is.equal( -45.12 );
			Functions.floor( -45.123, -1 ).should.be.Number().which.is.equal( -40 );
			Functions.floor( -45.123, -2 ).should.be.Number().which.is.equal( -0 );
			Functions.floor( -45.0000000000001 ).should.be.Number().which.is.equal( -45 );
			Functions.floor( -45.0000000000001, 1 ).should.be.Number().which.is.equal( -45 );
			Functions.floor( -45.0000000000001, 2 ).should.be.Number().which.is.equal( -45 );
			Functions.floor( -45.0000000000001, -1 ).should.be.Number().which.is.equal( -40 );
			Functions.floor( -45.0000000000001, -2 ).should.be.Number().which.is.equal( -0 );
			Functions.floor( "-10.0000000000001" ).should.be.Number().which.is.equal( -10 );
			Functions.floor( "-10.0000000000001", 1 ).should.be.Number().which.is.equal( -10 );
			Functions.floor( "-10.0000000000001", 2 ).should.be.Number().which.is.equal( -10 );
			Functions.floor( "-10.0000000000001", -1 ).should.be.Number().which.is.equal( -10 );
			Functions.floor( "-10.0000000000001", -2 ).should.be.Number().which.is.equal( -0 );
		} );
	} );

	describe( "contains `min` which", () => {
		it( "is a function", () => {
			Functions.min.should.be.Function();
		} );

		it( "returns solely provided numeric value", () => {
			Functions.min( 45.834 ).should.be.Number().which.is.equal( 45.834 );
		} );

		it( "returns numeric value described by solely provided string", () => {
			Functions.min( "45.834" ).should.be.Number().which.is.equal( 45.834 );
		} );

		it( "returns numeric value described by solely provided string", () => {
			Functions.min( "45.834" ).should.be.Number().which.is.equal( 45.834 );
		} );

		it( "returns NaN on providing any non-numeric value in sole argument", () => {
			Functions.min( null ).should.be.NaN();
			Functions.min( undefined ).should.be.NaN();
			Functions.min( false ).should.be.NaN();
			Functions.min( "" ).should.be.NaN();
			Functions.min( "Hello" ).should.be.NaN();
			Functions.min( [] ).should.be.NaN();
			Functions.min( ["Hello"] ).should.be.NaN();
			Functions.min( {} ).should.be.NaN();
			Functions.min( { value: 1 } ).should.be.NaN();
			Functions.min( function() { return 1; } ).should.be.NaN();
			Functions.min( () => 1 ).should.be.NaN();
		} );

		it( "returns least numeric value of several provided arguments", () => {
			Functions.min( 3, 5 ).should.be.Number().which.is.equal( 3 );
			Functions.min( "3", "5" ).should.be.Number().which.is.equal( 3 );
			Functions.min( 3, -5 ).should.be.Number().which.is.equal( -5 );
			Functions.min( "3", "-5" ).should.be.Number().which.is.equal( -5 );

			const least = -5;

			// generate several lists of random numeric values, inject some
			// non-numeric staff and some definitely least numeric value
			for ( let i = 0; i < 100; i++ ) {
				const set = new Array( 100 );

				for ( let j = 0; j < 100; j++ ) {
					set[j] = Math.random() * 100000000;
				}

				set[Math.floor( Math.random() * 100 )] = null;
				set[Math.floor( Math.random() * 100 )] = undefined;
				set[Math.floor( Math.random() * 100 )] = false;
				set[Math.floor( Math.random() * 100 )] = "";
				set[Math.floor( Math.random() * 100 )] = [];
				set[Math.floor( Math.random() * 100 )] = {};
				set[Math.floor( Math.random() * 100 )] = ["hello"];
				set[Math.floor( Math.random() * 100 )] = { value: -10 };
				set[Math.floor( Math.random() * 100 )] = () => -10;
				set[Math.floor( Math.random() * 100 )] = least;

				Functions.min( ...set ).should.be.Number().which.is.equal( least );
			}
		} );
	} );

	describe( "contains `max` which", () => {
		it( "is a function", () => {
			Functions.max.should.be.Function();
		} );

		it( "returns solely provided numeric value", () => {
			Functions.max( 45.834 ).should.be.Number().which.is.equal( 45.834 );
		} );

		it( "returns numeric value described by solely provided string", () => {
			Functions.max( "45.834" ).should.be.Number().which.is.equal( 45.834 );
		} );

		it( "returns numeric value described by solely provided string", () => {
			Functions.max( "45.834" ).should.be.Number().which.is.equal( 45.834 );
		} );

		it( "returns NaN on providing any non-numeric value in sole argument", () => {
			Functions.max( null ).should.be.NaN();
			Functions.max( undefined ).should.be.NaN();
			Functions.max( false ).should.be.NaN();
			Functions.max( "" ).should.be.NaN();
			Functions.max( "Hello" ).should.be.NaN();
			Functions.max( [] ).should.be.NaN();
			Functions.max( ["Hello"] ).should.be.NaN();
			Functions.max( {} ).should.be.NaN();
			Functions.max( { value: 1 } ).should.be.NaN();
			Functions.max( function() { return 1; } ).should.be.NaN();
			Functions.max( () => 1 ).should.be.NaN();
		} );

		it( "returns greatest numeric value of several provided arguments", () => {
			Functions.max( 3, 5 ).should.be.Number().which.is.equal( 5 );
			Functions.max( "3", "5" ).should.be.Number().which.is.equal( 5 );
			Functions.max( 3, -5 ).should.be.Number().which.is.equal( 3 );
			Functions.max( "3", "-5" ).should.be.Number().which.is.equal( 3 );

			const greatest = 50000001;

			// generate several lists of random numeric values, inject some
			// non-numeric staff and some definitely greatest numeric value
			for ( let i = 0; i < 100; i++ ) {
				const set = new Array( 100 );

				for ( let j = 0; j < 100; j++ ) {
					set[j] = ( Math.random() * 100000000 ) - 50000000;
				}

				set[Math.floor( Math.random() * 100 )] = null;
				set[Math.floor( Math.random() * 100 )] = undefined;
				set[Math.floor( Math.random() * 100 )] = false;
				set[Math.floor( Math.random() * 100 )] = "";
				set[Math.floor( Math.random() * 100 )] = [];
				set[Math.floor( Math.random() * 100 )] = {};
				set[Math.floor( Math.random() * 100 )] = ["hello"];
				set[Math.floor( Math.random() * 100 )] = { value: 50000002 };
				set[Math.floor( Math.random() * 100 )] = () => 50000002;
				set[Math.floor( Math.random() * 100 )] = greatest;

				Functions.max( ...set ).should.be.Number().which.is.equal( greatest );
			}
		} );
	} );

	describe( "contains `abs` which", () => {
		it( "is a function", () => {
			Functions.abs.should.be.Function();
		} );

		it( "returns NaN when invoked without argument", () => {
			Functions.abs().should.be.NaN();
		} );

		it( "returns NaN when invoked with non-numeric value in first argument", () => {
			Functions.abs( null ).should.be.NaN();
			Functions.abs( undefined ).should.be.NaN();
			Functions.abs( false ).should.be.NaN();
			Functions.abs( true ).should.be.NaN();
			Functions.abs( "" ).should.be.NaN();
			Functions.abs( [] ).should.be.NaN();
			Functions.abs( ["hello"] ).should.be.NaN();
			Functions.abs( {} ).should.be.NaN();
			Functions.abs( { value: -10 } ).should.be.NaN();
			Functions.abs( function() { return -10; } ).should.be.NaN();
			Functions.abs( () => -10 ).should.be.NaN();
		} );

		it( "returns absolute amount of numeric value provided in first argument", () => {
			for ( let i = 0; i < 500; i++ ) {
				const value = ( Math.random() * 100000000 ) - 50000000;
				const abs = value < 0 ? -value : value;

				Functions.abs( value ).should.be.Number().which.is.equal( abs );
				Functions.abs( `${value}` ).should.be.Number().which.is.equal( abs );
			}
		} );
	} );

	describe( "contains `formatnumber` which", () => {
		const positives = [
			1, 0.4, 0.03, 0.005, 0.00008,
			12345678, 12345678.4, 12345678.03, 12345678.005, 12345678.00008,
		];

		const negatives = [
			0,
			1, 0.4, 0.03, 0.005, 0.00008,
			12345678, 12345678.4, 12345678.03, 12345678.005, 12345678.00008,
		];

		it( "is a function", () => {
			Functions.formatnumber.should.be.Function();
		} );

		it( "returns empty string when invoked w/o any argument", () => {
			Functions.formatnumber().should.be.String().which.is.empty();
		} );

		it( "returns empty string on providing non-numeric value in first argument", () => {
			Functions.formatnumber( null ).should.be.String().which.is.empty();
			Functions.formatnumber( undefined ).should.be.String().which.is.empty();
			Functions.formatnumber( false ).should.be.String().which.is.empty();
			Functions.formatnumber( true ).should.be.String().which.is.empty();
			Functions.formatnumber( [] ).should.be.String().which.is.empty();
			Functions.formatnumber( ["hello"] ).should.be.String().which.is.empty();
			Functions.formatnumber( {} ).should.be.String().which.is.empty();
			Functions.formatnumber( { value: 1 } ).should.be.String().which.is.empty();
			Functions.formatnumber( "" ).should.be.String().which.is.empty();
			Functions.formatnumber( "hello" ).should.be.String().which.is.empty();
			Functions.formatnumber( function() { return 1; } ).should.be.String().which.is.empty();
			Functions.formatnumber( () => 1 ).should.be.String().which.is.empty();
		} );

		it( "returns string representing numeric value provided in first argument", () => {
			[0].concat( positives, negatives )
				.forEach( value => {
					Functions.formatnumber( value ).should.be.String().which.is.equal( `${value}` );
				} );
		} );

		it( "uses decimal separator optionally provided in second argument", () => {
			[ " ", ",", "_", ":", "A" ]
				.forEach( decimal => {
					[0].concat( positives, negatives )
						.forEach( value => {
							Functions.formatnumber( value, decimal ).should.be.String().which.is.equal( `${String( value ).replace( ".", decimal )}` );
						} );
				} );
		} );

		it( "uses thousands separator optionally provided in third argument", () => {
			[ " ", ",", "_", ":", "A" ]
				.forEach( thousands => {
					[0].concat( positives, negatives )
						.forEach( value => {
							const formatted = Functions.formatnumber( value, ".", thousands );

							formatted.should.be.String();

							if ( Math.abs( value ) >= 1000 ) {
								formatted.should.match( new RegExp( `^[^.]+${thousands}\\d{3}` ) )
									.and.should.not.match( /^[^.]+\d{4}/ );
							} else {
								formatted.should.not.match( new RegExp( `^[^.]+${thousands}\\d` ) );
							}
						} );
				} );
		} );

		it( "optionally renders number of fractional digits explicitly requested in fourth argument", () => {
			for ( let digits = 0; digits < 10; digits++ ) {
				[0].concat( positives, negatives )
					.forEach( value => {
						const scale = Math.pow( 10, digits );
						const formatted = Functions.formatnumber( value, ".", null, digits );

						if ( digits === 0 ) {
							formatted.should.not.match( /\.\d*$/ );
						} else if ( parseInt( value ) === Math.round( parseFloat( value ) * scale ) / scale ) {
							formatted.should.match( new RegExp( `\\.0{${digits}}$` ) );
						} else {
							formatted.should.match( new RegExp( `\\.\\d{${digits}}$` ) );
						}
					} );
			}
		} );

		it( "optionally renders number of fractional digits explicitly requested in fourth argument unless it would be all zeroes (using negative fraction size)", () => {
			for ( let digits = 1; digits < 10; digits++ ) {
				[0].concat( positives, negatives )
					.forEach( value => {
						const scale = Math.pow( 10, digits );
						const formatted = Functions.formatnumber( value, ".", null, -digits );

						formatted.should.be.String();

						if ( parseInt( value ) === Math.round( parseFloat( value ) * scale ) / scale ) {
							formatted.should.not.match( /\.\d*$/ );
						} else {
							formatted.should.match( new RegExp( `\\.\\d{${digits}}$` ) );
						}
					} );
			}
		} );

		it( "prepends string resulting from any provided value with proper sign on demand", () => {
			positives
				.forEach( value => {
					Functions.formatnumber( value, ".", "", null, true ).should.be.String().which.is.equal( `+${value}` );
				} );
		} );

		it( "never prepends resulting string with sign when representing 0", () => {
			Functions.formatnumber( 0, ".", "", null, true ).should.be.String().which.is.equal( `0` );
			Functions.formatnumber( 0, ".", "", 2, true ).should.be.String().which.is.equal( `0.00` );
		} );
	} );
} );
