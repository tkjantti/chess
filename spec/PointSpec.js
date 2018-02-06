
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
});
