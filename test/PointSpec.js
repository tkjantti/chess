
describe('Point', function () {
    "use strict";

    describe('toString', function () {
        it('returns position in correct format', function () {
            // top left
            expect(new CHESS_APP.Point(0, 0).toString()).toBe('a8');

            expect(new CHESS_APP.Point(0, 1).toString()).toBe('b8');
            expect(new CHESS_APP.Point(1, 0).toString()).toBe('a7');

            // top right
            expect(new CHESS_APP.Point(0, 7).toString()).toBe('h8');

            // bottom left
            expect(new CHESS_APP.Point(7, 0).toString()).toBe('a1');

            // bottom right
            expect(new CHESS_APP.Point(7, 7).toString()).toBe('h1');
        });
    });

    describe('fromString', function () {
        it('creates a point object from string form', function () {
            expect(CHESS_APP.Point.fromString('a8')).toEqual(new CHESS_APP.Point(0, 0));

            // top left
            expect(CHESS_APP.Point.fromString('a8')).toEqual(new CHESS_APP.Point(0, 0));

            expect(CHESS_APP.Point.fromString('b8')).toEqual(new CHESS_APP.Point(0, 1));
            expect(CHESS_APP.Point.fromString('a7')).toEqual(new CHESS_APP.Point(1, 0));

            // top right
            expect(CHESS_APP.Point.fromString('h8')).toEqual(new CHESS_APP.Point(0, 7));

            // bottom left
            expect(CHESS_APP.Point.fromString('a1')).toEqual(new CHESS_APP.Point(7, 0));

            // bottom right
            expect(CHESS_APP.Point.fromString('h1')).toEqual(new CHESS_APP.Point(7, 7));
        });
    });
});
