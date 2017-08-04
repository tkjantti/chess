
var CHESS_APP = CHESS_APP || {};

CHESS_APP.MoveResult = function (isLegal, actualMoves, positionInCheck) {
    "use strict";

    this.isLegal = isLegal;
    this.positionInCheck = positionInCheck;

    if (actualMoves) {
        if (actualMoves.length !== 1) {
            throw "Unknown kind of move";
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
    return '{ ' + this.actualMove.toString() +
            ' ' + this.isLegal +
            ' ' + this.positionInCheck +
            ' }';
};

CHESS_APP.MoveResult.prototype.toMoveNotationString = function () {
    "use strict";
    return this.actualMove.piece.getMoveNotationSymbol() +
            ' ' + this.actualMove.source.toString() +
            ' -> ' + this.actualMove.destination.toString();
};
