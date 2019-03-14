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

		it( "keeps fractional part of numeric value in first provided argument", () => {
			Functions.number( 0.0001 ).should.be.Number().which.is.equal( 0.0001 );
			Functions.number( -1.9 ).should.be.Number().which.is.equal( -1.9 );
		} );

		it( "ignores values provided in any additional argument", () => {
			Functions.number( 5.3, 1 ).should.be.Number().which.is.equal( 5.3 );
			Functions.number( 5.3, 1, 2 ).should.be.Number().which.is.equal( 5.3 );
			Functions.number( 5.3, 1, 2, 3 ).should.be.Number().which.is.equal( 5.3 );
			Functions.number( 5.3, 1, 2, 3, 4 ).should.be.Number().which.is.equal( 5.3 );
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

		it( "returns object with information on current date/time", () => {
			const value = Functions.now();

			value.should.have.property( "year" ).which.is.a.Number().and.is.greaterThan( 2018 );
			value.should.have.property( "month" ).which.is.a.Number().and.is.greaterThanOrEqual( 1 ).and.lessThanOrEqual( 12 );
			value.should.have.property( "day" ).which.is.a.Number().and.is.greaterThanOrEqual( 1 ).and.lessThanOrEqual( 31 );
			value.should.have.property( "hour" ).which.is.a.Number().and.is.greaterThanOrEqual( 0 ).and.lessThanOrEqual( 23 );
			value.should.have.property( "minute" ).which.is.a.Number().and.is.greaterThanOrEqual( 0 ).and.lessThanOrEqual( 59 );
			value.should.have.property( "second" ).which.is.a.Number().and.is.greaterThanOrEqual( 0 ).and.lessThanOrEqual( 59 );
			value.should.have.property( "dow" ).which.is.a.Number().and.is.greaterThanOrEqual( 0 ).and.lessThanOrEqual( 6 );
		} );
	} );

	describe( "contains `datetime` which", () => {
		it( "is a function", () => {
			Functions.datetime.should.be.Function();
		} );

		it( "returns string representing some described date/time", () => {
			Functions.datetime( "d.m.y", { day: 1, month: 1, year: 2019 } ).should.be.String().which.is.equal( "01.01.2019" );
			Functions.datetime( "d.m.y", { day: 31, month: 12, year: 2019 } ).should.be.String().which.is.equal( "31.12.2019" );
			Functions.datetime( "D.M.Y", { day: 1, month: 1, year: 2019 } ).should.be.String().which.is.equal( "01.01.2019" );
			Functions.datetime( "D.M.Y", { day: 31, month: 12, year: 2019 } ).should.be.String().which.is.equal( "31.12.2019" );
			Functions.datetime( "y-m-d", { day: 1, month: 1, year: 2019 } ).should.be.String().which.is.equal( "2019-01-01" );
			Functions.datetime( "y-m-d", { day: 31, month: 12, year: 2019 } ).should.be.String().which.is.equal( "2019-12-31" );
			Functions.datetime( "j.n.y", { day: 1, month: 1, year: 2019 } ).should.be.String().which.is.equal( "1.1.2019" );
			Functions.datetime( "j.n.y", { day: 31, month: 12, year: 2019 } ).should.be.String().which.is.equal( "31.12.2019" );
			Functions.datetime( "J.N.Y", { day: 1, month: 1, year: 2019 } ).should.be.String().which.is.equal( "1.1.2019" );
			Functions.datetime( "J.N.Y", { day: 31, month: 12, year: 2019 } ).should.be.String().which.is.equal( "31.12.2019" );

			Functions.datetime( "\\y-\\m-\\d", { day: 31, month: 12, year: 2019 } ).should.be.String().which.is.equal( "y-m-d" );
			Functions.datetime( "\\j.\\n.\\y", { day: 31, month: 12, year: 2019 } ).should.be.String().which.is.equal( "j.n.y" );
			Functions.datetime( "\\Y-\\M-\\D", { day: 31, month: 12, year: 2019 } ).should.be.String().which.is.equal( "Y-M-D" );
			Functions.datetime( "\\J.\\N.\\Y", { day: 31, month: 12, year: 2019 } ).should.be.String().which.is.equal( "J.N.Y" );

			Functions.datetime( "h:i:s", { hour: 0, minute: 0, second: 0 } ).should.be.String().which.is.equal( "00:00:00" );
			Functions.datetime( "h:i:s", { hour: 23, minute: 59, second: 59 } ).should.be.String().which.is.equal( "23:59:59" );
			Functions.datetime( "h:i:s", { hour: 9, minute: 9, second: 9 } ).should.be.String().which.is.equal( "09:09:09" );
			Functions.datetime( "g:i:s", { hour: 0, minute: 0, second: 0 } ).should.be.String().which.is.equal( "0:00:00" );
			Functions.datetime( "g:i:s", { hour: 23, minute: 59, second: 59 } ).should.be.String().which.is.equal( "23:59:59" );
			Functions.datetime( "g:i:s", { hour: 9, minute: 9, second: 9 } ).should.be.String().which.is.equal( "9:09:09" );

			Functions.datetime( "\\h:\\i:\\s", { hour: 9, minute: 9, second: 9 } ).should.be.String().which.is.equal( "h:i:s" );
			Functions.datetime( "\\H:\\I:\\S", { hour: 9, minute: 9, second: 9 } ).should.be.String().which.is.equal( "H:I:S" );
			Functions.datetime( "\\g:\\i:\\s", { hour: 9, minute: 9, second: 9 } ).should.be.String().which.is.equal( "g:i:s" );
			Functions.datetime( "\\G:\\I:\\S", { hour: 9, minute: 9, second: 9 } ).should.be.String().which.is.equal( "G:I:S" );

			Functions.datetime( "y-m-dTh:i:s", { day: 1, month: 1, year: 2019 } ).should.be.String().which.is.equal( "2019-01-01T00:00:00" );
			Functions.datetime( "y-m-dTh:i:s", { day: 31, month: 12, year: 2019 } ).should.be.String().which.is.equal( "2019-12-31T00:00:00" );
		} );
	} );

	describe( "contains `random` which", () => {
		it( "is a function", () => {
			Functions.random.should.be.Function();
		} );

		it( "returns random positive integer", () => {
			for ( let i = 0; i < 1000; i++ ) {
				Functions.random().should.be.Number().which.is.greaterThanOrEqual( 0 );
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
} );
