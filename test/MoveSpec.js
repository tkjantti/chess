/* jshint jasmine:true */

describe('Move', function () {
    "use strict";

    describe('serialize', function () {
        it('creates a json representation of the move', function () {
            var source = new CHESS_APP.Point(6, 2);
            var destination = new CHESS_APP.Point(5, 3);
            var move = new CHESS_APP.Move(source, destination);

            var result = move.serialize();

            expect(result).toEqual({
                from: "c2",
                to: "d3"
            });
        });
    });
});
