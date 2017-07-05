/* jshint jasmine:true */
/* global CHESS_APP */

describe('Turn', function () {
    "use strict";

    var turn;
    var rules = new CHESS_APP.Rules();
    var board;
    var source;
    var destination;
    var previousMove = null;

    beforeEach(function () {
        rules = new CHESS_APP.Rules();
        turn = new CHESS_APP.Turn(rules);
        board = new CHESS_APP.InMemoryBoard(8, 8);
        source = new CHESS_APP.Point(4, 4);
        destination = new CHESS_APP.Point(5, 4);
        previousMove = null;

        spyOn(rules, "isDraw").and.returnValue(false);
    });

    describe('move', function () {
        it('returns good move if the move is legal', function () {
            board.setPiece(source, new CHESS_APP.Piece("white", "pawn"));

            spyOn(rules, "inspectMove").and.returnValue({
                isLegal: true
            });
            spyOn(rules, "isInCheck").and.returnValue(null);

            var result = turn.move(board, source, destination);

            expect(result.result).toBe("good_move");
            expect(rules.inspectMove).toHaveBeenCalledWith(board, jasmine.objectContaining({
                player: "white",
                source: source,
                destination: destination
            }), previousMove);
            expect(rules.isInCheck).toHaveBeenCalledWith(jasmine.anything(), "white", previousMove);
        });

        it('makes the move if it is legal', function () {
            board.setPiece(source, new CHESS_APP.Piece("white", "pawn"));

            spyOn(rules, "inspectMove").and.returnValue({
                isLegal: true
            });
            spyOn(rules, "isInCheck").and.returnValue(null);
            spyOn(board, "move");

            var result = turn.move(board, source, destination);

            expect(result.result).toBe("good_move");
            expect(board.move).toHaveBeenCalledWith(source, destination);
        });

        it('changes the current player if the move succeeds', function () {
            board.setPiece(source, new CHESS_APP.Piece("white", "pawn"));

            spyOn(rules, "inspectMove").and.returnValue({
                isLegal: true
            });
            spyOn(rules, "isInCheck").and.returnValue(null);

            var result = turn.move(board, source, destination);

            expect(result.result).toBe("good_move");
            expect(turn.getCurrentPlayer()).toBe("black");
        });

        it('removes a piece if one is captured', function () {
            board.setPiece(source, new CHESS_APP.Piece("white", "rook"));
            board.setPiece(destination, new CHESS_APP.Piece("black", "pawn"));

            spyOn(rules, "inspectMove").and.returnValue({
                isLegal: true,
                capturePosition: new CHESS_APP.Point(3, 6)
            });
            spyOn(rules, "isInCheck").and.returnValue(null);
            spyOn(board, "removePiece");

            turn.move(board, source, destination);

            expect(board.removePiece).toHaveBeenCalledWith(jasmine.objectContaining({
                row: 3,
                column: 6
            }));
        });

        it('does not move if the move is not legal', function () {
            board.setPiece(source, new CHESS_APP.Piece("white", "pawn"));

            spyOn(rules, "inspectMove").and.returnValue({
                isLegal: false
            });
            spyOn(rules, "isInCheck").and.returnValue(null);
            spyOn(board, "move");

            var result = turn.move(board, source, destination);

            expect(result.result).toBe("bad_move");
            expect(board.move).not.toHaveBeenCalled();
        });

        it('does not move if the move would result in a check position', function () {
            var positionInCheck = new CHESS_APP.Point(4, 3);
            board.setPiece(source, new CHESS_APP.Piece("white", "pawn"));

            spyOn(rules, "inspectMove").and.returnValue({
                isLegal: true
            });
            spyOn(rules, "isInCheck").and.returnValue(positionInCheck);
            spyOn(board, "move");

            var result = turn.move(board, source, destination);

            expect(result.result).toBe("bad_move");
            expect(result.positionInCheck).toEqual(positionInCheck);
            expect(board.move).not.toHaveBeenCalled();
        });

        it('returns checkmate if the move results in a checkmate', function () {
            board.setPiece(source, new CHESS_APP.Piece("white", "pawn"));

            spyOn(rules, "inspectMove").and.returnValue({
                isLegal: true
            });
            spyOn(rules, "isInCheck").and.returnValue(null);
            spyOn(rules, "isInCheckMate").and.callFake(function (ignore, player) {
                return player === "black";
            });

            var result = turn.move(board, source, destination);

            expect(result.result).toBe("checkmate");
            expect(rules.isInCheckMate).toHaveBeenCalledWith(
                jasmine.anything(),
                "black",
                jasmine.anything());
        });

        it('changes the type of piece if a piece gets promoted', function () {
            board.setPiece(source, new CHESS_APP.Piece("white", "pawn"));

            spyOn(rules, "inspectMove").and.returnValue({
                isLegal: true,
                promotion: "queen"
            });
            spyOn(rules, "isInCheck").and.returnValue(null);
            spyOn(board, "move");
            spyOn(board, "changeTypeOfPiece");

            turn.move(board, source, destination);

            expect(board.move).toHaveBeenCalledWith(source, destination);
            expect(board.changeTypeOfPiece).toHaveBeenCalledWith(destination, "queen");
        });

        it('passes previous move to inspectMove', function () {
            var white_source = new CHESS_APP.Point(6, 0);
            var white_destination = new CHESS_APP.Point(5, 0);

            var black_source = new CHESS_APP.Point(1, 1);
            var black_destination = new CHESS_APP.Point(2, 1);

            board.setPiece(white_source, new CHESS_APP.Piece("white", "pawn"));
            board.setPiece(black_source, new CHESS_APP.Piece("black", "pawn"));

            spyOn(rules, "inspectMove").and.returnValue({
                isLegal: true
            });
            spyOn(rules, "isInCheck").and.returnValue(null);

            turn.move(board, white_source, white_destination);
            turn.move(board, black_source, black_destination);

            var actualPreviousMove = rules.inspectMove.calls.mostRecent().args[2];
            expect(actualPreviousMove.player).toBe("white");
            expect(actualPreviousMove.source).toEqual(white_source);
            expect(actualPreviousMove.destination).toEqual(white_destination);
        });

        it('returns draw if the move results in a draw', function () {
            board.setPiece(source, new CHESS_APP.Piece("white", "pawn"));

            spyOn(rules, "inspectMove").and.returnValue({
                isLegal: true
            });
            spyOn(rules, "isInCheck").and.returnValue(null);

            rules.isDraw.and.callFake(function (ignore, player) {
                if (player === "black") {
                    return true;
                } else {
                    return false;
                }
            });

            var result = turn.move(board, source, destination);

            expect(result.result).toBe("draw");
        });

        it('does not return draw if the move does not result in a draw', function () {
            board.setPiece(source, new CHESS_APP.Piece("white", "pawn"));

            spyOn(rules, "inspectMove").and.returnValue({
                isLegal: true
            });
            spyOn(rules, "isInCheck").and.returnValue(null);

            rules.isDraw.and.returnValue(false);

            var result = turn.move(board, source, destination);

            expect(result.result).not.toBe("draw");
        });
    });
});
