/* jshint jasmine:true */
/* global CHESS_APP */

describe('MoveResult', function () {
    "use strict";

    describe('toMoveNotationString', function () {
        it('Prints move result in a simple notation', function () {
            var moveResult = new CHESS_APP.MoveResult(
                true,
                [
                    new CHESS_APP.ActualMove(
                        new CHESS_APP.Piece("white", "pawn"),
                        new CHESS_APP.Point(6, 1),
                        new CHESS_APP.Point(5, 1))
                ]);

            var result = moveResult.toMoveNotationString();

            expect(result).toBe('P b2 -> b3');
        });

        it('prints kingside castling in correct notation', function () {
            var moveResult = new CHESS_APP.MoveResult(
                true,
                [
                    new CHESS_APP.ActualMove(
                        new CHESS_APP.Piece('white', 'king'),
                        new CHESS_APP.Point(7, 4),
                        new CHESS_APP.Point(7, 6)
                    ),
                    new CHESS_APP.ActualMove(
                        new CHESS_APP.Piece('white', 'rook'),
                        new CHESS_APP.Point(7, 7),
                        new CHESS_APP.Point(7, 5)
                    )
                ],
                null,
                CHESS_APP.CASTLING_KING_SIDE);

            var actual = moveResult.toMoveNotationString();

            expect(actual).toBe("0-0");
        });

        it('prints queenside castling in correct notation', function () {
            var moveResult = new CHESS_APP.MoveResult(
                true,
                [
                    new CHESS_APP.ActualMove(
                        new CHESS_APP.Piece('white', 'king'),
                        new CHESS_APP.Point(7, 4),
                        new CHESS_APP.Point(7, 2)
                    ),
                    new CHESS_APP.ActualMove(
                        new CHESS_APP.Piece('white', 'rook'),
                        new CHESS_APP.Point(7, 0),
                        new CHESS_APP.Point(7, 3)
                    )
                ],
                null,
                CHESS_APP.CASTLING_QUEEN_SIDE);

            var actual = moveResult.toMoveNotationString();

            expect(actual).toBe("0-0-0");
        });
    });

    describe('hasSource', function () {
        it('is not when the move is not from the given square', function () {
            var moveResult = new CHESS_APP.MoveResult(
                true,
                [
                    new CHESS_APP.ActualMove(
                        new CHESS_APP.Piece('white', 'king'),
                        new CHESS_APP.Point(7, 4),
                        new CHESS_APP.Point(6, 5)
                    )
                ]
            );

            var actual = moveResult.hasSource(new CHESS_APP.Point(8, 4));

            expect(actual).toBe(false);
        });

        it('is when the move is from the given square', function () {
            var moveResult = new CHESS_APP.MoveResult(
                true,
                [
                    new CHESS_APP.ActualMove(
                        new CHESS_APP.Piece('white', 'king'),
                        new CHESS_APP.Point(7, 4),
                        new CHESS_APP.Point(6, 5)
                    )
                ]
            );

            var actual = moveResult.hasSource(new CHESS_APP.Point(7, 4));

            expect(actual).toBe(true);
        });

        it('is when one of the moves is from the given source', function () {
            var moveResult = new CHESS_APP.MoveResult(
                true,
                [
                    new CHESS_APP.ActualMove(
                        new CHESS_APP.Piece('white', 'king'),
                        new CHESS_APP.Point(7, 4),
                        new CHESS_APP.Point(7, 6)
                    ),
                    new CHESS_APP.ActualMove(
                        new CHESS_APP.Piece('white', 'rook'),
                        new CHESS_APP.Point(7, 7),
                        new CHESS_APP.Point(7, 5)
                    )
                ],
                null,
                CHESS_APP.CASTLING_KING_SIDE
            );

            var actual = moveResult.hasSource(new CHESS_APP.Point(7, 7));

            expect(actual).toBe(true);
        });
    });

    describe('hasDestination', function () {
        it('returns true when one of the moves has the given destination', function () {
            var moveResult = new CHESS_APP.MoveResult(
                true,
                [
                    new CHESS_APP.ActualMove(
                        new CHESS_APP.Piece('white', 'king'),
                        new CHESS_APP.Point(7, 4),
                        new CHESS_APP.Point(7, 6)
                    ),
                    new CHESS_APP.ActualMove(
                        new CHESS_APP.Piece('white', 'rook'),
                        new CHESS_APP.Point(7, 7),
                        new CHESS_APP.Point(7, 5)
                    )
                ],
                null,
                CHESS_APP.CASTLING_KING_SIDE
            );

            var actual = moveResult.hasDestination(new CHESS_APP.Point(7, 5));

            expect(actual).toBe(true);
        });

        it('returns false when none of the moves has the given destination', function () {
            var moveResult = new CHESS_APP.MoveResult(
                true,
                [
                    new CHESS_APP.ActualMove(
                        new CHESS_APP.Piece('white', 'king'),
                        new CHESS_APP.Point(7, 4),
                        new CHESS_APP.Point(7, 6)
                    ),
                    new CHESS_APP.ActualMove(
                        new CHESS_APP.Piece('white', 'rook'),
                        new CHESS_APP.Point(7, 7),
                        new CHESS_APP.Point(7, 5)
                    )
                ],
                null,
                CHESS_APP.CASTLING_KING_SIDE
            );

            var actual = moveResult.hasDestination(new CHESS_APP.Point(0, 0));

            expect(actual).toBe(false);
        });
    });

    describe('isVerticalWithLengthOfTwo', function () {
        it('returns false when none of the moves is vertical', function () {
            var moveResult = new CHESS_APP.MoveResult(
                true,
                [
                    new CHESS_APP.ActualMove(
                        new CHESS_APP.Piece('white', 'king'),
                        new CHESS_APP.Point(7, 4),
                        new CHESS_APP.Point(7, 6)
                    ),
                    new CHESS_APP.ActualMove(
                        new CHESS_APP.Piece('white', 'rook'),
                        new CHESS_APP.Point(7, 7),
                        new CHESS_APP.Point(7, 5)
                    )
                ],
                null,
                CHESS_APP.CASTLING_KING_SIDE
            );

            var actual = moveResult.isVerticalWithLengthOfTwo();

            expect(actual).toBe(false);
        });

        it('returns false when the move is vertical with length of one', function () {
            var moveResult = new CHESS_APP.MoveResult(
                true,
                [
                    new CHESS_APP.ActualMove(
                        new CHESS_APP.Piece("black", "pawn"),
                        new CHESS_APP.Point(1, 1),
                        new CHESS_APP.Point(2, 1))
                ]);

            var actual = moveResult.isVerticalWithLengthOfTwo();

            expect(actual).toBe(false);
        });

        it('returns true when the move is vertical with length of two', function () {
            var moveResult = new CHESS_APP.MoveResult(
                true,
                [
                    new CHESS_APP.ActualMove(
                        new CHESS_APP.Piece("black", "pawn"),
                        new CHESS_APP.Point(1, 1),
                        new CHESS_APP.Point(3, 1))
                ]);

            var actual = moveResult.isVerticalWithLengthOfTwo();

            expect(actual).toBe(true);
        });

        it('returns true when the move is vertical with absolute length of two', function () {
            var moveResult = new CHESS_APP.MoveResult(
                true,
                [
                    new CHESS_APP.ActualMove(
                        new CHESS_APP.Piece("white", "pawn"),
                        new CHESS_APP.Point(6, 1),
                        new CHESS_APP.Point(4, 1))
                ]);

            var actual = moveResult.isVerticalWithLengthOfTwo();

            expect(actual).toBe(true);
        });
    });
});
