
var CHESS_APP = CHESS_APP || {};

CHESS_APP.MoveResult = function (isLegal, actualMoves, positionInCheck, castling) {
    "use strict";

    this.isLegal = isLegal;
    this.positionInCheck = positionInCheck;
    this.castling = (castling ? castling : CHESS_APP.CASTLING_NONE);

    if (actualMoves && this.castling === CHESS_APP.CASTLING_NONE) {
        if (actualMoves.length < 1) {
            throw "Move is missing";
        }
        this.actualMove = actualMoves[0];
    } else {
        this.actualMove = null;
    }
};

CHESS_APP.MoveResult.prototype.getPlayer = function () {
    "use strict";
    return this.actualMove.piece.player;
};

CHESS_APP.MoveResult.prototype.toString = function () {
    "use strict";
    return '{ ' + (this.actualMove ? this.actualMove.toString() : "") +
            ' ' + this.isLegal +
            ' ' + this.positionInCheck +
            ' ' + this.castling +
            ' }';
};

CHESS_APP.MoveResult.prototype.toMoveNotationString = function () {
    "use strict";

    if (this.castling === CHESS_APP.CASTLING_KING_SIDE) {
        return "0-0";
    }
    if (this.castling === CHESS_APP.CASTLING_QUEEN_SIDE) {
        return "0-0-0";
    }

    return this.actualMove.piece.getMoveNotationSymbol() +
            ' ' + this.actualMove.source.toString() +
            ' -> ' + this.actualMove.destination.toString();
};
