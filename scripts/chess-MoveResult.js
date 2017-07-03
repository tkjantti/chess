/* global CHESS_APP */

CHESS_APP.createMoveResult = function (move, result, piece, positionInCheck) {
    "use strict";

    return {
        move: move,
        piece: piece,
        result: result,
        positionInCheck: positionInCheck,
        getPlayer: function () {
            return move.player;
        },
        isGood: function () {
            return result !== "bad_move";
        },
        isCheckMate: function () {
            return result === "checkmate";
        },
        isDraw: function () {
            return result === "draw";
        },
        toString: function () {
            return this.piece.getMoveNotationSymbol() +
                    ' ' + this.move.source.toString() + ' -> ' + this.move.destination.toString();
        }
    };
};

