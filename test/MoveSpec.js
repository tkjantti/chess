/* jshint jasmine:true */

describe('Move', function () {
    "use strict";

    describe('serialize', function () {
        it('creates a json representation of the move', function () {
            var move = new CHESS_APP.Move(
                new CHESS_APP.Point(6, 2),
                new CHESS_APP.Point(5, 3));

            var result = move.serialize();

            expect(result).toEqual({
                from: "c2",
                to: "d3"
            });
        });
    });

    describe('deserialize', function () {
        it('creates an object from a json representation', function () {
            var json = {
                from: "c2",
                to: "d3"
            };

            var actual = CHESS_APP.Move.deserialize(json);

            expect(actual).toEqual(
                new CHESS_APP.Move(
                    new CHESS_APP.Point(6, 2),
                    new CHESS_APP.Point(5, 3)));
        });
    });
});
