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

/* eslint-disable max-nested-callbacks */

import Should from "should";

import { Tokenizer, Compiler } from "../";

describe( "Term Compiler", () => {
	const TokenTypes = Tokenizer.Types;

	it( "is available", () => {
		Should.exist( Compiler );
	} );

	describe( "provides static method `reduceTokens` which", () => {
		it( "is available", () => {
			Compiler.reduceTokens.should.be.Function().which.has.length( 2 );
		} );

		it( "is invoked w/ sequence of tokens and map of supported functions", () => {
			Compiler.reduceTokens( [], {} ).should.be.an.Array().which.is.empty();
		} );

		it( "reduces sequence of keyword tokens and dereferencing operator tokens into single keyword w/ combined value", () => {
			Compiler.reduceTokens( [
				{ type: TokenTypes.KEYWORD, value: "some" },
				{ type: TokenTypes.DEREF_OPERATOR, value: "." },
				{ type: TokenTypes.KEYWORD, value: "subordinated" },
				{ type: TokenTypes.DEREF_OPERATOR, value: "." },
				{ type: TokenTypes.KEYWORD, value: "name" },
			], {} )
				.map( token => ( { type: token.type, value: token.value } ) )
				.should.be.an.Array()
				.which.containEql( { type: TokenTypes.KEYWORD, value: "some.subordinated.name" } )
				.and.has.length( 1 );
		} );

		it( "partially reduces arbitrary but valid sequences of keyword tokens and dereferencing operator tokens", () => {
			Compiler.reduceTokens( [
				{ type: TokenTypes.KEYWORD, value: "some" },
				{ type: TokenTypes.KEYWORD, value: "subordinated" },
				{ type: TokenTypes.DEREF_OPERATOR, value: "." },
				{ type: TokenTypes.KEYWORD, value: "path" },
			], {} )
				.map( token => ( { type: token.type, value: token.value } ) )
				.should.be.an.Array()
				.which.is.deepEqual( [
					{ type: TokenTypes.KEYWORD, value: "some" },
					{ type: TokenTypes.KEYWORD, value: "subordinated.path" },
				] );

			Compiler.reduceTokens( [
				{ type: TokenTypes.KEYWORD, value: "some" },
				{ type: TokenTypes.DEREF_OPERATOR, value: "." },
				{ type: TokenTypes.KEYWORD, value: "subordinated" },
				{ type: TokenTypes.KEYWORD, value: "path" },
			], {} )
				.map( token => ( { type: token.type, value: token.value } ) )
				.should.be.an.Array()
				.which.is.deepEqual( [
					{ type: TokenTypes.KEYWORD, value: "some.subordinated" },
					{ type: TokenTypes.KEYWORD, value: "path" },
				] );
		} );

		it( "does not reduce and combine sequence of keyword tokens", () => {
			Compiler.reduceTokens( [
				{ type: TokenTypes.KEYWORD, value: "some" },
				{ type: TokenTypes.KEYWORD, value: "subordinated" },
				{ type: TokenTypes.KEYWORD, value: "name" },
			], {} )
				.map( token => ( { type: token.type, value: token.value } ) )
				.should.be.an.Array()
				.which.containEql( { type: TokenTypes.KEYWORD, value: "some" } )
				.which.containEql( { type: TokenTypes.KEYWORD, value: "subordinated" } )
				.which.containEql( { type: TokenTypes.KEYWORD, value: "name" } )
				.and.has.length( 3 );
		} );

		describe( "reduces sequence of negation operators by", () => {
			it( "replacing odd number of occurrences w/ single one", () => {
				Compiler.reduceTokens( [
					{ type: TokenTypes.UNARY_LOGIC_OPERATOR, value: "!" },
				], {} )
					.map( token => ( { type: token.type, value: token.value } ) )
					.should.be.an.Array()
					.which.containEql( { type: TokenTypes.UNARY_LOGIC_OPERATOR, value: "!" } )
					.and.has.length( 1 );

				Compiler.reduceTokens( [
					{ type: TokenTypes.UNARY_LOGIC_OPERATOR, value: "!" },
					{ type: TokenTypes.UNARY_LOGIC_OPERATOR, value: "!" },
					{ type: TokenTypes.UNARY_LOGIC_OPERATOR, value: "!" },
				], {} )
					.map( token => ( { type: token.type, value: token.value } ) )
					.should.be.an.Array()
					.which.containEql( { type: TokenTypes.UNARY_LOGIC_OPERATOR, value: "!" } )
					.and.has.length( 1 );

				Compiler.reduceTokens( [
					{ type: TokenTypes.UNARY_LOGIC_OPERATOR, value: "!" },
					{ type: TokenTypes.UNARY_LOGIC_OPERATOR, value: "!" },
					{ type: TokenTypes.UNARY_LOGIC_OPERATOR, value: "!" },
					{ type: TokenTypes.UNARY_LOGIC_OPERATOR, value: "!" },
					{ type: TokenTypes.UNARY_LOGIC_OPERATOR, value: "!" },
				], {} )
					.map( token => ( { type: token.type, value: token.value } ) )
					.should.be.an.Array()
					.which.containEql( { type: TokenTypes.UNARY_LOGIC_OPERATOR, value: "!" } )
					.and.has.length( 1 );
			} );
		} );

		describe( "is tagging tokens in resulting sequence", () => {
			describe( "as literals", () => {
				it( "when representing integer value", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.LITERAL_INTEGER, value: "0" },
					], {} )
						.map( token => token.literal )
						.should.be.an.Array()
						.which.is.deepEqual( [true] );
				} );

				it( "when representing float value", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.LITERAL_FLOAT, value: "0.0" },
					], {} )
						.map( token => token.literal )
						.should.be.an.Array()
						.which.is.deepEqual( [true] );
				} );

				it( "when representing string value", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.LITERAL_STRING, value: "''" },
					], {} )
						.map( token => token.literal )
						.should.be.an.Array()
						.which.is.deepEqual( [true] );
				} );

				it( "when representing special keyword representing boolean value", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "true" },
						{ type: TokenTypes.KEYWORD, value: "false" },
					], {} )
						.map( token => token.literal )
						.should.be.an.Array()
						.which.is.deepEqual( [ true, true ] );
				} );

				it( "when representing special keyword representing `null` value", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "null" },
					], {} )
						.map( token => token.literal )
						.should.be.an.Array()
						.which.is.deepEqual( [true] );
				} );
			} );

			describe( "as non-literals", () => {
				it( "when representing any keyword", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "_" },
					], {} )
						.map( token => token.literal )
						.should.be.an.Array()
						.which.is.deepEqual( [false] );

					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "_" },
						{ type: TokenTypes.DEREF_OPERATOR, value: "." },
						{ type: TokenTypes.KEYWORD, value: "sub" },
					], {} )
						.map( token => token.literal )
						.should.be.an.Array()
						.which.is.deepEqual( [false] );

					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "_" },
						{ type: TokenTypes.KEYWORD, value: "sub" },
					], {} )
						.map( token => token.literal )
						.should.be.an.Array()
						.which.is.deepEqual( [ false, false ] );
				} );

				it( "when representing parentheses", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.PARENTHESIS },
						{ type: TokenTypes.PARENTHESIS },
					], {} )
						.map( token => token.literal )
						.should.be.an.Array()
						.which.is.deepEqual( [ false, false ] );
				} );

				it( "when representing commata", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.COMMA },
					], {} )
						.map( token => token.literal )
						.should.be.an.Array()
						.which.is.deepEqual( [false] );
				} );

				it( "when representing operators", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.BINARY_COMPARISON_OPERATOR },
						{ type: TokenTypes.BINARY_ARITHMETIC_OPERATOR },
						{ type: TokenTypes.BINARY_LOGIC_OPERATOR },
						{ type: TokenTypes.UNARY_LOGIC_OPERATOR },
					], {} )
						.map( token => token.literal )
						.should.be.an.Array()
						.which.is.deepEqual( [ false, false, false, false ] );
				} );
			} );

			describe( "as operands", () => {
				it( "when representing integer value", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.LITERAL_INTEGER, value: "0" },
					], {} )
						.map( token => token.operand )
						.should.be.an.Array()
						.which.is.deepEqual( [true] );
				} );

				it( "when representing float value", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.LITERAL_FLOAT, value: "0.0" },
					], {} )
						.map( token => token.operand )
						.should.be.an.Array()
						.which.is.deepEqual( [true] );
				} );

				it( "when representing string value", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.LITERAL_STRING, value: "''" },
					], {} )
						.map( token => token.operand )
						.should.be.an.Array()
						.which.is.deepEqual( [true] );
				} );

				it( "when representing special keyword representing boolean value", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "true" },
						{ type: TokenTypes.KEYWORD, value: "false" },
					], {} )
						.map( token => token.operand )
						.should.be.an.Array()
						.which.is.deepEqual( [ true, true ] );
				} );

				it( "when representing special keyword representing `null` value", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "null" },
					], {} )
						.map( token => token.operand )
						.should.be.an.Array()
						.which.is.deepEqual( [true] );
				} );

				it( "when representing any keyword", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "_" },
					], {} )
						.map( token => token.operand )
						.should.be.an.Array()
						.which.is.deepEqual( [true] );

					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "_" },
						{ type: TokenTypes.DEREF_OPERATOR, value: "." },
						{ type: TokenTypes.KEYWORD, value: "sub" },
					], {} )
						.map( token => token.operand )
						.should.be.an.Array()
						.which.is.deepEqual( [true] );

					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "_" },
						{ type: TokenTypes.KEYWORD, value: "sub" },
					], {} )
						.map( token => token.operand )
						.should.be.an.Array()
						.which.is.deepEqual( [ true, true ] );
				} );
			} );

			describe( "as non-operands", () => {
				it( "when representing parentheses", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.PARENTHESIS },
						{ type: TokenTypes.PARENTHESIS },
					], {} )
						.map( token => token.operand )
						.should.be.an.Array()
						.which.is.deepEqual( [ false, false ] );
				} );

				it( "when representing commata", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.COMMA },
					], {} )
						.map( token => token.operand )
						.should.be.an.Array()
						.which.is.deepEqual( [false] );
				} );

				it( "when representing operators", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.BINARY_COMPARISON_OPERATOR },
						{ type: TokenTypes.BINARY_ARITHMETIC_OPERATOR },
						{ type: TokenTypes.BINARY_LOGIC_OPERATOR },
						{ type: TokenTypes.UNARY_LOGIC_OPERATOR },
					], {} )
						.map( token => token.operand )
						.should.be.an.Array()
						.which.is.deepEqual( [ false, false, false, false ] );
				} );
			} );

			describe( "as operators", () => {
				it( "when representing operators", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.BINARY_COMPARISON_OPERATOR },
						{ type: TokenTypes.BINARY_ARITHMETIC_OPERATOR },
						{ type: TokenTypes.BINARY_LOGIC_OPERATOR },
						{ type: TokenTypes.UNARY_LOGIC_OPERATOR },
					], {} )
						.map( token => token.operator )
						.should.be.an.Array()
						.which.is.deepEqual( [ true, true, true, true ] );
				} );
			} );

			describe( "as non-operators", () => {
				it( "when representing integer value", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.LITERAL_INTEGER, value: "0" },
					], {} )
						.map( token => token.operator )
						.should.be.an.Array()
						.which.is.deepEqual( [false] );
				} );

				it( "when representing float value", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.LITERAL_FLOAT, value: "0.0" },
					], {} )
						.map( token => token.operator )
						.should.be.an.Array()
						.which.is.deepEqual( [false] );
				} );

				it( "when representing string value", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.LITERAL_STRING, value: "''" },
					], {} )
						.map( token => token.operator )
						.should.be.an.Array()
						.which.is.deepEqual( [false] );
				} );

				it( "when representing special keyword representing boolean value", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "true" },
						{ type: TokenTypes.KEYWORD, value: "false" },
					], {} )
						.map( token => token.operator )
						.should.be.an.Array()
						.which.is.deepEqual( [ false, false ] );
				} );

				it( "when representing special keyword representing `null` value", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "null" },
					], {} )
						.map( token => token.operator )
						.should.be.an.Array()
						.which.is.deepEqual( [false] );
				} );

				it( "when representing any keyword", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "_" },
					], {} )
						.map( token => token.operator )
						.should.be.an.Array()
						.which.is.deepEqual( [false] );

					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "_" },
						{ type: TokenTypes.DEREF_OPERATOR, value: "." },
						{ type: TokenTypes.KEYWORD, value: "sub" },
					], {} )
						.map( token => token.operator )
						.should.be.an.Array()
						.which.is.deepEqual( [false] );

					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "_" },
						{ type: TokenTypes.KEYWORD, value: "sub" },
					], {} )
						.map( token => token.operator )
						.should.be.an.Array()
						.which.is.deepEqual( [ false, false ] );
				} );

				it( "when representing parentheses", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.PARENTHESIS },
						{ type: TokenTypes.PARENTHESIS },
					], {} )
						.map( token => token.operator )
						.should.be.an.Array()
						.which.is.deepEqual( [ false, false ] );
				} );

				it( "when representing commata", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.COMMA },
					], {} )
						.map( token => token.operator )
						.should.be.an.Array()
						.which.is.deepEqual( [false] );
				} );
			} );

			describe( "as variable accessor", () => {
				it( "when representing any keyword not succeeded by opening parenthesis", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "_" },
					], {} )
						.map( token => token.variable )
						.should.be.an.Array()
						.which.is.deepEqual( [true] );

					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "_" },
						{ type: TokenTypes.DEREF_OPERATOR, value: "." },
						{ type: TokenTypes.KEYWORD, value: "sub" },
					], {} )
						.map( token => token.variable )
						.should.be.an.Array()
						.which.is.deepEqual( [true] );

					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "_" },
						{ type: TokenTypes.KEYWORD, value: "sub" },
					], {} )
						.map( token => token.variable )
						.should.be.an.Array()
						.which.is.deepEqual( [ true, true ] );
				} );

				it( "when representing sequence of keyword tokens and dereferencing operator tokens succeeded by opening parenthesis", () => {
					// by intention compiler does not support invocation of methods or organizing functions in namespaces
					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "_" },
						{ type: TokenTypes.DEREF_OPERATOR, value: "." },
						{ type: TokenTypes.KEYWORD, value: "sub" },
						{ type: TokenTypes.PARENTHESIS, value: "(" },
					], {} )
						.map( token => token.variable )
						.should.be.an.Array()
						.which.is.deepEqual( [ true, false ] );
				} );
			} );

			describe( "as non-variable-accessor", () => {
				it( "when representing any keyword succeeded by opening parenthesis", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "_" },
						{ type: TokenTypes.PARENTHESIS, value: "(" },
					], { _: () => 0 } )
						.map( token => token.variable )
						.should.be.an.Array()
						.which.is.deepEqual( [ false, false ] );

					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "_" },
						{ type: TokenTypes.KEYWORD, value: "sub" },
						{ type: TokenTypes.PARENTHESIS, value: "(" },
					], { sub: () => 0 } )
						.map( token => token.variable )
						.should.be.an.Array()
						.which.is.deepEqual( [ true, false, false ] );
				} );

				it( "when representing integer value", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.LITERAL_INTEGER, value: "0" },
					], {} )
						.map( token => token.variable )
						.should.be.an.Array()
						.which.is.deepEqual( [false] );
				} );

				it( "when representing float value", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.LITERAL_FLOAT, value: "0.0" },
					], {} )
						.map( token => token.variable )
						.should.be.an.Array()
						.which.is.deepEqual( [false] );
				} );

				it( "when representing string value", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.LITERAL_STRING, value: "''" },
					], {} )
						.map( token => token.variable )
						.should.be.an.Array()
						.which.is.deepEqual( [false] );
				} );

				it( "when representing special keyword representing boolean value", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "true" },
						{ type: TokenTypes.KEYWORD, value: "false" },
					], {} )
						.map( token => token.variable )
						.should.be.an.Array()
						.which.is.deepEqual( [ false, false ] );
				} );

				it( "when representing special keyword representing `null` value", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "null" },
					], {} )
						.map( token => token.variable )
						.should.be.an.Array()
						.which.is.deepEqual( [false] );
				} );

				it( "when representing parentheses", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.PARENTHESIS },
						{ type: TokenTypes.PARENTHESIS },
					], {} )
						.map( token => token.variable )
						.should.be.an.Array()
						.which.is.deepEqual( [ false, false ] );
				} );

				it( "when representing commata", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.COMMA },
					], {} )
						.map( token => token.variable )
						.should.be.an.Array()
						.which.is.deepEqual( [false] );
				} );

				it( "when representing operators", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.BINARY_COMPARISON_OPERATOR },
						{ type: TokenTypes.BINARY_ARITHMETIC_OPERATOR },
						{ type: TokenTypes.BINARY_LOGIC_OPERATOR },
						{ type: TokenTypes.UNARY_LOGIC_OPERATOR },
					], {} )
						.map( token => token.variable )
						.should.be.an.Array()
						.which.is.deepEqual( [ false, false, false, false ] );
				} );
			} );

			describe( "as function accessor", () => {
				it( "when representing any keyword succeeded by opening parenthesis", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "_" },
						{ type: TokenTypes.PARENTHESIS, value: "(" },
					], { _: () => 0 } )
						.map( token => token.function )
						.should.be.an.Array()
						.which.is.deepEqual( [ true, false ] );

					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "_" },
						{ type: TokenTypes.KEYWORD, value: "sub" },
						{ type: TokenTypes.PARENTHESIS, value: "(" },
					], { sub: () => 0 } )
						.map( token => token.function )
						.should.be.an.Array()
						.which.is.deepEqual( [ false, true, false ] );
				} );
			} );

			describe( "as non-function-accessor", () => {
				it( "when representing any keyword not succeeded by opening parenthesis", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "_" },
					], {} )
						.map( token => token.function )
						.should.be.an.Array()
						.which.is.deepEqual( [false] );

					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "_" },
						{ type: TokenTypes.DEREF_OPERATOR, value: "." },
						{ type: TokenTypes.KEYWORD, value: "sub" },
					], {} )
						.map( token => token.function )
						.should.be.an.Array()
						.which.is.deepEqual( [false] );

					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "_" },
						{ type: TokenTypes.KEYWORD, value: "sub" },
					], {} )
						.map( token => token.function )
						.should.be.an.Array()
						.which.is.deepEqual( [ false, false ] );
				} );

				it( "when representing sequence of keyword tokens and dereferencing operator tokens succeeded by opening parenthesis", () => {
					// by intention compiler does not support invocation of methods or organizing functions in namespaces
					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "_" },
						{ type: TokenTypes.DEREF_OPERATOR, value: "." },
						{ type: TokenTypes.KEYWORD, value: "sub" },
						{ type: TokenTypes.PARENTHESIS, value: "(" },
					], {} )
						.map( token => token.function )
						.should.be.an.Array()
						.which.is.deepEqual( [ false, false ] );
				} );

				it( "when representing integer value", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.LITERAL_INTEGER, value: "0" },
					], {} )
						.map( token => token.function )
						.should.be.an.Array()
						.which.is.deepEqual( [false] );
				} );

				it( "when representing float value", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.LITERAL_FLOAT, value: "0.0" },
					], {} )
						.map( token => token.function )
						.should.be.an.Array()
						.which.is.deepEqual( [false] );
				} );

				it( "when representing string value", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.LITERAL_STRING, value: "''" },
					], {} )
						.map( token => token.function )
						.should.be.an.Array()
						.which.is.deepEqual( [false] );
				} );

				it( "when representing special keyword representing boolean value", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "true" },
						{ type: TokenTypes.KEYWORD, value: "false" },
					], {} )
						.map( token => token.function )
						.should.be.an.Array()
						.which.is.deepEqual( [ false, false ] );
				} );

				it( "when representing special keyword representing `null` value", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.KEYWORD, value: "null" },
					], {} )
						.map( token => token.function )
						.should.be.an.Array()
						.which.is.deepEqual( [false] );
				} );

				it( "when representing parentheses", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.PARENTHESIS },
						{ type: TokenTypes.PARENTHESIS },
					], {} )
						.map( token => token.function )
						.should.be.an.Array()
						.which.is.deepEqual( [ false, false ] );
				} );

				it( "when representing commata", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.COMMA },
					], {} )
						.map( token => token.function )
						.should.be.an.Array()
						.which.is.deepEqual( [false] );
				} );

				it( "when representing operators", () => {
					Compiler.reduceTokens( [
						{ type: TokenTypes.BINARY_COMPARISON_OPERATOR },
						{ type: TokenTypes.BINARY_ARITHMETIC_OPERATOR },
						{ type: TokenTypes.BINARY_LOGIC_OPERATOR },
						{ type: TokenTypes.UNARY_LOGIC_OPERATOR },
					], {} )
						.map( token => token.function )
						.should.be.an.Array()
						.which.is.deepEqual( [ false, false, false, false ] );
				} );
			} );
		} );

		describe( "throws on", () => {
			it( "whitespace tokens due to requiring those being removed prior to compilation", () => {
				( () => Compiler.reduceTokens( [
					{ type: TokenTypes.WHITESPACE, value: " " },
				], {} ) ).should.throw();
			} );

			it( "invalid sequences of keyword tokens and dereferencing operator tokens", () => {
				( () => Compiler.reduceTokens( [
					{ type: TokenTypes.KEYWORD, value: "some" },
					{ type: TokenTypes.DEREF_OPERATOR, value: "." },
				], {} ) ).should.throw();

				( () => Compiler.reduceTokens( [
					{ type: TokenTypes.KEYWORD, value: "some" },
					{ type: TokenTypes.DEREF_OPERATOR, value: "." },
					{ type: TokenTypes.DEREF_OPERATOR, value: "." },
				], {} ) ).should.throw();

				( () => Compiler.reduceTokens( [
					{ type: TokenTypes.KEYWORD, value: "some" },
					{ type: TokenTypes.KEYWORD, value: "subordinated" },
					{ type: TokenTypes.DEREF_OPERATOR, value: "." },
				], {} ) ).should.throw();

				( () => Compiler.reduceTokens( [
					{ type: TokenTypes.DEREF_OPERATOR, value: "." },
					{ type: TokenTypes.KEYWORD, value: "some" },
				], {} ) ).should.throw();
			} );

			it( "encountering dereferencing operator token w/o preceding keyword token", () => {
				( () => Compiler.reduceTokens( [
					{ type: TokenTypes.DEREF_OPERATOR, value: "." },
				], {} ) )
					.should.throw();
			} );

			it( "keyword token with succeeding parenthesis token addressing non-declared function", () => {
				( () => Compiler.reduceTokens( [
					{ type: TokenTypes.KEYWORD, value: "_" },
					{ type: TokenTypes.PARENTHESIS, value: "(" },
				], {} ) )
					.should.throw();

				( () => Compiler.reduceTokens( [
					{ type: TokenTypes.KEYWORD, value: "_" },
					{ type: TokenTypes.PARENTHESIS, value: "(" },
				], { _: null } ) )
					.should.throw();

				( () => Compiler.reduceTokens( [
					{ type: TokenTypes.KEYWORD, value: "_" },
					{ type: TokenTypes.PARENTHESIS, value: "(" },
				], { _: true } ) )
					.should.throw();

				( () => Compiler.reduceTokens( [
					{ type: TokenTypes.KEYWORD, value: "_" },
					{ type: TokenTypes.PARENTHESIS, value: "(" },
				], { _: () => 0 } ) )
					.should.not.throw();
			} );
		} );
	} );

	describe( "provides static method `compile()` which", () => {
		it( "requires provision of non-empty source code", () => {
			( () => Compiler.compile() ).should.throw();
			( () => Compiler.compile( null ) ).should.throw();
			( () => Compiler.compile( undefined ) ).should.throw();
			( () => Compiler.compile( "" ) ).should.throw();
			( () => Compiler.compile( "    " ) ).should.throw();
			( () => Compiler.compile( "  \r\n \t " ) ).should.throw();
		} );

		it( "converts string containing source code of a term into invocable function", () => {
			const compiled = Compiler.compile( "1" );

			compiled.should.be.Function();
			compiled().should.be.equal( 1 );
		} );

		describe( "properly compiles", () => {
			it( "literal integers", () => {
				Compiler.compile( "0" )().should.be.equal( 0 );
				Compiler.compile( "00000000000123" )().should.be.equal( 123 );
				Compiler.compile( "+00000000000123" )().should.be.equal( 123 );
				Compiler.compile( "-00000000000123" )().should.be.equal( -123 );
			} );

			it( "literal floating-point numbers", () => {
				Compiler.compile( "0.0" )().should.be.equal( 0.0 );
				Compiler.compile( ".5" )().should.be.equal( 0.5 );
				Compiler.compile( "000000000001.23" )().should.be.equal( 1.23 );
				Compiler.compile( "+00000000000.123" )().should.be.equal( 0.123 );
				Compiler.compile( "-0000000000.0123" )().should.be.equal( -0.0123 );
			} );

			it( "literal strings", () => {
				Compiler.compile( "''" )().should.be.equal( "" );
				Compiler.compile( '""' )().should.be.equal( "" );
				Compiler.compile( "'Hello World!'" )().should.be.equal( "Hello World!" );
				Compiler.compile( '"Hello World!"' )().should.be.equal( "Hello World!" );
			} );

			it( "literal booleans", () => {
				Compiler.compile( "true" )().should.be.true();
				Compiler.compile( "TruE" )().should.be.true();
				Compiler.compile( "TRUE" )().should.be.true();
				Compiler.compile( "false" )().should.be.false();
				Compiler.compile( "FaLse" )().should.be.false();
				Compiler.compile( "FALSE" )().should.be.false();
			} );

			it( "literal null", () => {
				Should( Compiler.compile( "null" )() ).be.null();
				Should( Compiler.compile( "NuLl" )() ).be.null();
				Should( Compiler.compile( "NULL" )() ).be.null();

				Should( Compiler.compile( "  null" )() ).be.null();
				Should( Compiler.compile( "NuLl\r" )() ).be.null();
				Should( Compiler.compile( "\n NULL \f " )() ).be.null();
			} );

			it( "read-access on variables", () => {
				( () => Compiler.compile( "someKey" )() ).should.throw();

				Should( Compiler.compile( "someKey" )( {} ) ).be.undefined();
				Should( Compiler.compile( "someKey" )( { someKey: true } ) ).be.undefined();
				Should( Compiler.compile( "someKey" )( { somekey: true } ) ).be.true();
				Should( Compiler.compile( "SOMEKey" )( { somekey: true } ) ).be.true();
				Should( Compiler.compile( "SOMEKEY" )( { somekey: true } ) ).be.true();
				Should( Compiler.compile( "somekey" )( { somekey: true } ) ).be.true();
				Should( Compiler.compile( "somekey" )( { SOMEKEY: true } ) ).be.undefined();

				const data = {
					major: {
						minor: {
							micro: "baz",
							nano: {
								foo: "bar",
							},
						}
					}
				};

				Should( Compiler.compile( "MAJOR" )( data ) ).be.Object().which.has.property( "minor" );
				Should( Compiler.compile( "MINOR" )( data ) ).be.undefined();
				Should( Compiler.compile( "MAJOR.MINOR" )( data ) ).be.Object().which.has.properties( [ "micro", "nano" ] );
				Should( Compiler.compile( "MAJOR.MINOR.foo" )( data ) ).be.undefined();
				Should( Compiler.compile( "MAJOR.MINOR.MICRO" )( data ) ).be.equal( "baz" );
				Should( Compiler.compile( "MAJOR.MINOR.nano.foo" )( data ) ).be.equal( "bar" );
			} );

			it( "binary arithmetic operations", () => {
				Compiler.compile( "0 + 4" )().should.be.equal( 4 );
				Compiler.compile( "40*40" )().should.be.equal( 1600 );
				Compiler.compile( "500/2" )().should.be.equal( 250 );
				Compiler.compile( " 6-2 " )().should.be.equal( 4 );

				Compiler.compile( "0 + 4 +5" )().should.be.equal( 9 );
				Compiler.compile( "40* 40*2 " )().should.be.equal( 3200 );
				Compiler.compile( "500/2 /5" )().should.be.equal( 50 );
				Compiler.compile( " 6-2 - 1" )().should.be.equal( 3 );

				Compiler.compile( "0 + 4 *5" )().should.be.equal( 20 );
				Compiler.compile( "40* 40-2 " )().should.be.equal( 1598 );
				Compiler.compile( "500/2 *5" )().should.be.equal( 1250 );
				Compiler.compile( " 6-2 / 0.5" )().should.be.equal( 2 );

				Compiler.compile( "40* (40-2 ) " )().should.be.equal( 1520 );
				Compiler.compile( "( 6-2 )/ 0.5" )().should.be.equal( 8 );

				Compiler.compile( "2 * amount" )( { amount: 5 } ).should.be.equal( 10 );
				Compiler.compile( "amount + 4" )( { amount: 5 } ).should.be.equal( 9 );
				Compiler.compile( "amount++3.0" )( { amount: 5 } ).should.be.equal( 8 );
				Compiler.compile( "amount - -2" )( { amount: 5 } ).should.be.equal( 7 );
				Compiler.compile( "amount--1" )( { amount: 5 } ).should.be.equal( 6 );
				Compiler.compile( "25/amount" )( { amount: 5 } ).should.be.equal( 5 );
				Compiler.compile( "16/( amount- 1)" )( { amount: 5 } ).should.be.equal( 4 );
			} );

			it( "binary logical operations", () => {
				Compiler.compile( "1 & 4" )().should.be.equal( 0 );
				Compiler.compile( "1 | 4" )().should.be.equal( 5 );
				Compiler.compile( "1 && 4" )().should.be.equal( 4 );
				Compiler.compile( "1 || 4" )().should.be.equal( 1 );

				Compiler.compile( "0 && 4 && 5" )().should.be.equal( 0 );
				Compiler.compile( "false && 4 && 5" )().should.be.equal( false );
				Compiler.compile( "0 || 4 || 5" )().should.be.equal( 4 );
				Compiler.compile( "false || 4 || 5" )().should.be.equal( 4 );

				Compiler.compile( "0 && 4 || 5" )().should.be.equal( 5 );
				Compiler.compile( "false || 4 && 5" )().should.be.equal( 5 );
				Compiler.compile( "0 || 4 && 5" )().should.be.equal( 5 );
				Compiler.compile( "false && 4 || 5" )().should.be.equal( 5 );

				Compiler.compile( "amount || 3" )( { amount: true } ).should.be.equal( true );
				Compiler.compile( "amount && 3" )( { amount: true } ).should.be.equal( 3 );
				Compiler.compile( "amount | 3" )( { amount: 4 } ).should.be.equal( 7 );
				Compiler.compile( "amount & 4" )( { amount: 7 } ).should.be.equal( 4 );

				Compiler.compile( "( amount & 1 ) || 3" )( { amount: 4 } ).should.be.equal( 3 );
				Compiler.compile( "amount | ( 2 && 8 )" )( { amount: 4 } ).should.be.equal( 12 );
			} );

			it( "binary comparison operations", () => {
				Compiler.compile( "0 < 4" )().should.be.true();
				Compiler.compile( "4 < 4" )().should.be.false();
				Compiler.compile( "'4' < 4" )().should.be.false();
				Compiler.compile( "4.5 > 4" )().should.be.true();
				Compiler.compile( "4 > 4" )().should.be.false();
				Compiler.compile( "4 > '4'" )().should.be.false();

				Compiler.compile( "3.5 <= 4" )().should.be.true();
				Compiler.compile( "4 <= 4" )().should.be.true();
				Compiler.compile( "4 <= '4'" )().should.be.true();
				Compiler.compile( "4.5 >= 4" )().should.be.true();
				Compiler.compile( "4 >= 4" )().should.be.true();
				Compiler.compile( "'4' >= 4" )().should.be.true();

				Compiler.compile( "0 == 0" )().should.be.true();
				Compiler.compile( "'4'==4" )().should.be.true();
				Compiler.compile( "0 <> 0" )().should.be.false();
				Compiler.compile( "0<>'0'" )().should.be.false();
			} );

			it( "unary logical operations", () => {
				Compiler.compile( "!true" )().should.be.false();
				Compiler.compile( "!1" )().should.be.false();
				Compiler.compile( "!'hello world'" )().should.be.false();
				Compiler.compile( "!!'hello world'" )().should.be.true();
				Compiler.compile( "!!('hello world')" )().should.be.true();
				Compiler.compile( "!(!('hello world'))" )().should.be.true();
				Compiler.compile( "!!null" )().should.be.false();
			} );

			it( "function invocations", () => {
				( () => Compiler.compile( "myfunc()" ) ).should.throw();
				( () => Compiler.compile( "myfunc()", { myfunc: null } ) ).should.throw();
				( () => Compiler.compile( "myfunc()", { myfunc: true } ) ).should.throw();
				( () => Compiler.compile( "myfunc()", { myFunc: true } ) ).should.throw();
				( () => Compiler.compile( "myFunc()", { myFunc: true } ) ).should.throw();
				( () => Compiler.compile( "myfunc()", { myfunc: () => null } ) ).should.not.throw();
				( () => Compiler.compile( "myFunc()", { myFunc: () => null } ) ).should.throw();
				( () => Compiler.compile( "myFunc()", { myfunc: () => null } ) ).should.not.throw();

				( () => Compiler.compile( "myFunc()", { myfunc: () => null } )() ).should.throw();
				( () => Compiler.compile( "myFunc()", { myfunc: () => null } )( {} ) ).should.throw();
				( () => Compiler.compile( "myFunc()", { myfunc: () => null } )( {}, { myfunc: null } ) ).should.throw();
				( () => Compiler.compile( "myFunc()", { myfunc: () => null } )( {}, { myfunc: true } ) ).should.throw();
				( () => Compiler.compile( "myFunc()", { myfunc: () => null } )( {}, { myfunc: () => null } ) ).should.not.throw();
				( () => Compiler.compile( "myFunc()", { myfunc: () => null } )( {}, { myFunc: () => null } ) ).should.throw();

				Should( Compiler.compile( "myFunc()", { myfunc: () => null } )( {}, { myfunc: () => null } ) )
					.be.null();
				Compiler.compile( "myFunc()", { myfunc: () => null } )( {}, { myfunc: () => true } ).should.be.true();

				Compiler.compile( "square( 4 )", { square: a => a } )( {}, { square: a => a * a } ).should.be.equal( 16 );
				Compiler.compile( "sum( 4,5 )", { sum: () => null } )( {}, { sum: ( a, b ) => a + b } ).should.be.equal( 9 );
				Compiler.compile( "UPPER( 'hello' )", { upper: () => null } )( {}, { upper: s => s.toUpperCase() } ).should.be.equal( "HELLO" );

				Compiler.compile( "sQUARE( Sum(4, 5) + 2 )", { square: a => a, sum: a => a } )( {}, { square: a => a * a, sum: ( a, b ) => a + b } ).should.be.equal( 121 );
			} );

			it( "operations w/ complex operands ", () => {
				const functions = {
					square: a => a * a,
					sum: ( a, b ) => a + b,
				};

				Compiler.compile( "sQUARE( Sum(4, 5) + 2 ) - 10 < ( ( 3 + 5 ) * SUM( 30, 10 ) / SUM( 1, SQUARE( 0.7 ) ) )", functions )( {}, functions )
					.should.be.true();
			} );
		} );
	} );
} );
