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

        it('prints kingside castling in correct notation', function () {
            var moveResult = new CHESS_APP.MoveResult(
                true,
                null,
                null,
                CHESS_APP.CASTLING_KING_SIDE);

            var actual = moveResult.toMoveNotationString();

            expect(actual).toBe("0-0");
        });

        it('prints queenside castling in correct notation', function () {
            var moveResult = new CHESS_APP.MoveResult(
                true,
                null,
                null,
                CHESS_APP.CASTLING_QUEEN_SIDE);

            var actual = moveResult.toMoveNotationString();

            expect(actual).toBe("0-0-0");
        });
    });
});
