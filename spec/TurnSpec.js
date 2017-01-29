/*jslint fudge:true */
/*global $, jasmine, describe, beforeEach, it, expect, spyOn, CHESS_APP, CHESS_TEST */

describe('Turn', function () {
    "use strict";

    var turn;
    var rules = CHESS_APP.createRules();
    var board;
    var source;
    var destination;

    beforeEach(function () {
        rules = CHESS_APP.createRules();
        turn = CHESS_APP.createTurn(rules);
        board = CHESS_APP.createInMemoryBoard(8, 8);
        source = CHESS_APP.createPoint(4, 4);
        destination = CHESS_APP.createPoint(5, 4);

        // dummy methods so that these methods can
        // be spied on with inMemoryBoard.
        board.removePiece = function (position) {
            console.log(position);
        };
    });

    describe('move', function () {
        it('returns good move if the move is legal', function () {
            board.setPiece(source, CHESS_APP.createPiece("white", "pawn"));

            spyOn(rules, "inspectMove").and.returnValue({
                isLegal: true
            });
            spyOn(rules, "isInCheck").and.returnValue(null);

            var move = turn.move(board, source, destination);

            expect(move.result).toBe("good_move");
            expect(rules.inspectMove).toHaveBeenCalledWith(board, source, destination);
            expect(rules.isInCheck).toHaveBeenCalledWith(jasmine.anything(), "white");
        });

        it('makes the move if it is legal', function () {
            board.setPiece(source, CHESS_APP.createPiece("white", "pawn"));

            spyOn(rules, "inspectMove").and.returnValue({
                isLegal: true
            });
            spyOn(rules, "isInCheck").and.returnValue(null);
            spyOn(board, "move");

            var move = turn.move(board, source, destination);

            expect(move.result).toBe("good_move");
            expect(board.move).toHaveBeenCalledWith(source, destination);
        });

        it('changes the current player if the move succeeds', function () {
            board.setPiece(source, CHESS_APP.createPiece("white", "pawn"));

            spyOn(rules, "inspectMove").and.returnValue({
                isLegal: true
            });
            spyOn(rules, "isInCheck").and.returnValue(null);

            var move = turn.move(board, source, destination);

            expect(move.result).toBe("good_move");
            expect(turn.getCurrentPlayer()).toBe("black");
        });

        it('removes a piece if one is captured', function () {
            board.setPiece(source, CHESS_APP.createPiece("white", "rook"));
            board.setPiece(destination, CHESS_APP.createPiece("black", "pawn"));

            spyOn(rules, "inspectMove").and.returnValue({
                isLegal: true
            });
            spyOn(rules, "isInCheck").and.returnValue(null);
            spyOn(board, "removePiece");

            turn.move(board, source, destination);

            expect(board.removePiece).toHaveBeenCalledWith(destination);
        });

        it('does not move if there is no piece in source position', function () {
            spyOn(rules, "inspectMove").and.returnValue({
                isLegal: true
            });
            spyOn(rules, "isInCheck").and.returnValue(null);
            spyOn(board, "move");

            var move = turn.move(board, source, destination);

            expect(move.result).toBe("bad_move");
            expect(board.move).not.toHaveBeenCalled();
        });

        it('does not move if the move is not legal', function () {
            board.setPiece(source, CHESS_APP.createPiece("white", "pawn"));

            spyOn(rules, "inspectMove").and.returnValue({
                isLegal: false
            });
            spyOn(rules, "isInCheck").and.returnValue(null);
            spyOn(board, "move");

            var move = turn.move(board, source, destination);

            expect(move.result).toBe("bad_move");
            expect(board.move).not.toHaveBeenCalled();
        });

        it('does not move if the move would result in a check position', function () {
            var positionInCheck = CHESS_APP.createPoint(4, 3);
            board.setPiece(source, CHESS_APP.createPiece("white", "pawn"));

            spyOn(rules, "inspectMove").and.returnValue({
                isLegal: true
            });
            spyOn(rules, "isInCheck").and.returnValue(positionInCheck);
            spyOn(board, "move");

            var move = turn.move(board, source, destination);

            expect(move.result).toBe("bad_move");
            expect(move.positionInCheck).toEqual(positionInCheck);
            expect(board.move).not.toHaveBeenCalled();
        });

        it('returns checkmate if the move results in a checkmate', function () {
            board.setPiece(source, CHESS_APP.createPiece("white", "pawn"));

            spyOn(rules, "inspectMove").and.returnValue({
                isLegal: true
            });
            spyOn(rules, "isInCheck").and.returnValue(null);
            spyOn(rules, "isInCheckMate").and.callFake(function (ignore, player) {
                return player === "black";
            });

            var move = turn.move(board, source, destination);

            expect(move.result).toBe("checkmate");
            expect(rules.isInCheckMate).toHaveBeenCalledWith(jasmine.anything(), "black");
        });
    });
});
