/*jslint fudge:true */
/*global $, jasmine, describe, beforeEach, it, xit, expect, objectContaining, CHESS_APP, CHESS_TEST */

describe('InMemoryBoard', function () {
    "use strict";

    describe('removePiece', function () {
        it('leaves no pieces if the removed piece is the only one', function () {
            var board = CHESS_TEST.boardState([
                "K       ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        "
            ]);

            board.removePiece(CHESS_APP.createPoint(0, 0));

            expect(board.getPieces()).toEqual([]);
        });

        it('removes the piece from the given position', function () {
            var board = CHESS_TEST.boardState([
                "K       ",
                "      k ",
                " P      ",
                "        ",
                "        ",
                "    q   ",
                "        ",
                "        "
            ]);

            board.removePiece(CHESS_APP.createPoint(2, 1));

            expect(board.getPieces().length).toEqual(3);
        });
    });
});
