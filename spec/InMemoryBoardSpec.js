/* jshint jasmine:true */
/* global CHESS_APP, CHESS_TEST */

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

            board.removePiece(new CHESS_APP.Point(0, 0));

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

            board.removePiece(new CHESS_APP.Point(2, 1));

            expect(board.getPieces().length).toEqual(3);
        });
    });
});
