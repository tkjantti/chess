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
        board.removePiece = function (position) {
            // dummy method so that removePiece method can
            // be spied on with inMemoryBoard.
            console.log(position);
        };
        source = CHESS_APP.createPoint(4, 4);
        destination = CHESS_APP.createPoint(5, 4);
    });

    describe('move', function () {
        it('returns success if the move is legal', function () {
            board.setPiece(source, CHESS_APP.createPiece("white", "pawn"));

            spyOn(rules, "isLegalMove").and.returnValue(true);
            spyOn(rules, "isInCheck").and.returnValue(null);

            var result = turn.move(board, source, destination);

            expect(result.success).toBe(true);
            expect(rules.isLegalMove).toHaveBeenCalledWith(board, source, destination);
            expect(rules.isInCheck).toHaveBeenCalledWith(jasmine.anything(), "white");
        });

        it('makes the move if it is legal', function () {
            board.setPiece(source, CHESS_APP.createPiece("white", "pawn"));

            spyOn(rules, "isLegalMove").and.returnValue(true);
            spyOn(rules, "isInCheck").and.returnValue(null);
            spyOn(board, "move");

            var result = turn.move(board, source, destination);

            expect(result.success).toBe(true);
            expect(board.move).toHaveBeenCalledWith(source, destination);
        });

        it('changes the current player if the move succeeds', function () {
            board.setPiece(source, CHESS_APP.createPiece("white", "pawn"));

            spyOn(rules, "isLegalMove").and.returnValue(true);
            spyOn(rules, "isInCheck").and.returnValue(null);

            var result = turn.move(board, source, destination);

            expect(result.success).toBe(true);
            expect(turn.getCurrentPlayer()).toBe("black");
        });

        it('removes a piece if one is captured', function () {
            board.setPiece(source, CHESS_APP.createPiece("white", "rook"));
            board.setPiece(destination, CHESS_APP.createPiece("black", "pawn"));

            spyOn(rules, "isLegalMove").and.returnValue(true);
            spyOn(rules, "isInCheck").and.returnValue(null);
            spyOn(board, "removePiece");

            turn.move(board, source, destination);

            expect(board.removePiece).toHaveBeenCalledWith(destination);
        });

        it('does not move if there is no piece in source position', function () {
            spyOn(rules, "isLegalMove").and.returnValue(true);
            spyOn(rules, "isInCheck").and.returnValue(null);
            spyOn(board, "move");

            var result = turn.move(board, source, destination);

            expect(result.success).toBe(false);
            expect(board.move).not.toHaveBeenCalled();
        });

        it('does not move if the move is not legal', function () {
            board.setPiece(source, CHESS_APP.createPiece("white", "pawn"));

            spyOn(rules, "isLegalMove").and.returnValue(false);
            spyOn(rules, "isInCheck").and.returnValue(null);
            spyOn(board, "move");

            var result = turn.move(board, source, destination);

            expect(result.success).toBe(false);
            expect(board.move).not.toHaveBeenCalled();
        });

        it('does not move if the move would result in a check position', function () {
            var positionInCheck = CHESS_APP.createPoint(4, 3);
            board.setPiece(source, CHESS_APP.createPiece("white", "pawn"));

            spyOn(rules, "isLegalMove").and.returnValue(true);
            spyOn(rules, "isInCheck").and.returnValue(positionInCheck);
            spyOn(board, "move");

            var result = turn.move(board, source, destination);

            expect(result.success).toBe(false);
            expect(result.positionInCheck).toEqual(positionInCheck);
            expect(board.move).not.toHaveBeenCalled();
        });
    });
});
