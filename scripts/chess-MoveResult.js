
var CHESS_APP = CHESS_APP || {};

CHESS_APP.MoveResult = function (move, isLegal, piece, positionInCheck) {
    "use strict";
    this.move = move;
    this.piece = piece;
    this.isLegal = isLegal;
    this.positionInCheck = positionInCheck;
};

CHESS_APP.MoveResult.prototype.getPlayer = function () {
    "use strict";
    return this.move.player;
};

CHESS_APP.MoveResult.prototype.toString = function () {
    "use strict";
    return this.piece.getMoveNotationSymbol() +
            ' ' + this.move.source.toString() +
            ' -> ' + this.move.destination.toString();
};
