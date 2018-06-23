
describe("MoveLog", function () {
    "use strict";

    function createSimpleMoveResult (piece, source, destination) {
        return new CHESS_APP.MoveResult(
            true,
            [
                new CHESS_APP.ActualMove(piece, source, destination)
            ]
        );
    }

    describe('hasAnyPieceMovedFrom', function () {
        it('has not if the move log is empty', function () {
            var log = new CHESS_APP.MoveLog();

            var actual = log.hasAnyPieceMovedFrom(new CHESS_APP.Point(7, 7));

            expect(actual).toBe(false);
        });

        it('has not if no move has the given position as source', function () {
            var log = new CHESS_APP.MoveLog();
            log.add(createSimpleMoveResult(
                new CHESS_APP.Piece("white", "pawn"),
                new CHESS_APP.Point(6, 0),
                new CHESS_APP.Point(5, 0)
            ));
            log.add(createSimpleMoveResult(
                new CHESS_APP.Piece("black", "pawn"),
                new CHESS_APP.Point(1, 0),
                new CHESS_APP.Point(2, 0)
            ));
            log.add(createSimpleMoveResult(
                new CHESS_APP.Piece("white", "pawn"),
                new CHESS_APP.Point(6, 1),
                new CHESS_APP.Point(5, 1)
            ));
            log.add(createSimpleMoveResult(
                new CHESS_APP.Piece("black", "pawn"),
                new CHESS_APP.Point(1, 1),
                new CHESS_APP.Point(2, 1)
            ));

            var actual = log.hasAnyPieceMovedFrom(new CHESS_APP.Point(2, 1));

            expect(actual).toBe(false);
        });

        it('has if some move has the given position as source', function () {
            var log = new CHESS_APP.MoveLog();
            log.add(createSimpleMoveResult(
                new CHESS_APP.Piece("white", "pawn"),
                new CHESS_APP.Point(6, 0),
                new CHESS_APP.Point(5, 0)
            ));
            log.add(createSimpleMoveResult(
                new CHESS_APP.Piece("black", "pawn"),
                new CHESS_APP.Point(1, 0),
                new CHESS_APP.Point(2, 0)
            ));
            log.add(new CHESS_APP.MoveResult(
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
            ));

            var actual = log.hasAnyPieceMovedFrom(new CHESS_APP.Point(7, 7));

            expect(actual).toBe(true);

        });
    });

    describe('serializeMoves', function () {
        it('creates a json representation of the moves', function () {
            var log = new CHESS_APP.MoveLog();
            log.add(createSimpleMoveResult(
                new CHESS_APP.Piece("white", "pawn"),
                new CHESS_APP.Point(6, 1),
                new CHESS_APP.Point(5, 2)
            ));
            log.add(createSimpleMoveResult(
                new CHESS_APP.Piece("black", "pawn"),
                new CHESS_APP.Point(1, 3),
                new CHESS_APP.Point(2, 3)
            ));
            log.add(createSimpleMoveResult(
                new CHESS_APP.Piece("white", "knight"),
                new CHESS_APP.Point(7, 1),
                new CHESS_APP.Point(5, 2)
            ));

            var result = log.serializeMoves();

            expect(result).toEqual([
                {
                    from: "b2",
                    to: "c3"
                },
                {
                    from: "d7",
                    to: "d6"
                },
                {
                    from: "b1",
                    to: "c3"
                }
            ]);
        });
    });

    describe('deserializeMoves', function () {
        it('creates an array of moves from a JSON representation', function () {
            var json = [
                {
                    from: "b2",
                    to: "c3"
                },
                {
                    from: "d7",
                    to: "d6"
                },
                {
                    from: "b1",
                    to: "c3"
                }
            ];

            var actual = CHESS_APP.MoveLog.deserializeMoves(json);

            var expectedLog = new CHESS_APP.MoveLog();
            expectedLog.add(new CHESS_APP.Move(
                new CHESS_APP.Point(6, 1),
                new CHESS_APP.Point(5, 2)
            ));
            expectedLog.add(new CHESS_APP.Move(
                new CHESS_APP.Point(1, 3),
                new CHESS_APP.Point(2, 3)
            ));
            expectedLog.add(new CHESS_APP.Move(
                new CHESS_APP.Point(7, 1),
                new CHESS_APP.Point(5, 2)
            ));
            expect(actual).toEqual(expectedLog);
        });
    });
});
