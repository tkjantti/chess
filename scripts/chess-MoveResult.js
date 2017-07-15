
var CHESS_APP = CHESS_APP || {};

CHESS_APP.MoveResult = function (move, result, piece, positionInCheck) {
    "use strict";
    this.move = move;
    this.piece = piece;
    this.result = result;
    this.positionInCheck = positionInCheck;
};

CHESS_APP.MoveResult.prototype.getPlayer = function () {
    "use strict";
    return this.move.player;
};
CHESS_APP.MoveResult.prototype.isGood = function () {
    "use strict";
    return this.result !== "bad_move";
};
CHESS_APP.MoveResult.prototype.isCheckMate = function () {
    "use strict";
    return this.result === "checkmate";
};
CHESS_APP.MoveResult.prototype.isDraw = function () {
    "use strict";
    return this.result === "draw";
};
CHESS_APP.MoveResult.prototype.toString = function () {
    "use strict";
    return this.piece.getMoveNotationSymbol() +
            ' ' + this.move.source.toString() +
            ' -> ' + this.move.destination.toString();
};
