/* jshint jasmine:true */
/* global CHESS_APP */

describe('MoveResult', function () {
    "use strict";

    describe('toMoveNotationString', function () {
        it('Prints move result in a simple notation', function () {
            var move = new CHESS_APP.Move(
                "white",
                new CHESS_APP.Point(6, 1),
                new CHESS_APP.Point(5, 1));
            var piece = new CHESS_APP.Piece("white", "pawn");
            var moveResult = new CHESS_APP.MoveResult(move, "good_move", piece);

            var result = moveResult.toMoveNotationString();

            expect(result).toBe('P b2 -> b3');
        });
    });
});
