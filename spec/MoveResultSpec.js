/* jshint jasmine:true */
/* global CHESS_APP */

describe('MoveResult', function () {
    "use strict";

    describe('toString', function () {
        it('Prints move result in a simple notation', function () {
            var move = CHESS_APP.createMove(
                "white",
                CHESS_APP.createPoint(6, 1),
                CHESS_APP.createPoint(5, 1));
            var piece = CHESS_APP.createPiece("white", "pawn");
            var moveResult = CHESS_APP.createMoveResult(move, "good_move", piece);

            var result = moveResult.toString();

            expect(result).toBe('P b2 -> b3');
        });
    });
});
