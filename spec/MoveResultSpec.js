/* jshint jasmine:true */
/* global CHESS_APP */

describe('MoveResult', function () {
    "use strict";

    describe('toMoveNotationString', function () {
        it('Prints move result in a simple notation', function () {
            var actualMoves = [
                new CHESS_APP.ActualMove(
                    new CHESS_APP.Piece("white", "pawn"),
                    new CHESS_APP.Point(6, 1),
                    new CHESS_APP.Point(5, 1))
            ];
            var moveResult = new CHESS_APP.MoveResult(true, actualMoves);

            var result = moveResult.toMoveNotationString();

            expect(result).toBe('P b2 -> b3');
        });
    });
});
