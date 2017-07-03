/* jshint jasmine:true */
/* global CHESS_APP */

describe('Point', function () {
    "use strict";

    describe('toString', function () {
        it('returns position in correct format', function () {
            // top left
            expect(CHESS_APP.createPoint(0, 0).toString()).toBe('a8');

            expect(CHESS_APP.createPoint(0, 1).toString()).toBe('b8');
            expect(CHESS_APP.createPoint(1, 0).toString()).toBe('a7');

            // top right
            expect(CHESS_APP.createPoint(0, 7).toString()).toBe('h8');

            // bottom left
            expect(CHESS_APP.createPoint(7, 0).toString()).toBe('a1');

            // bottom right
            expect(CHESS_APP.createPoint(7, 7).toString()).toBe('h1');
        });
    });
});
