
var CHESS_APP = CHESS_APP || {};

CHESS_APP.MoveResult = function (isLegal, actualMoves, positionInCheck, castling) {
    "use strict";

    if (isLegal && (!actualMoves || actualMoves.length === 0)) {
        throw "At least one actual move expected";
    }

    this.isLegal = isLegal;
    this.actualMoves = (actualMoves ? actualMoves : []);
    this.positionInCheck = positionInCheck;
    this.castling = (castling ? castling : CHESS_APP.CASTLING_NONE);
};

CHESS_APP.MoveResult.prototype.getPlayer = function () {
    "use strict";
    var move = this.actualMoves[0];
    return move.piece.player;
};

CHESS_APP.MoveResult.prototype.hasSource = function (position) {
    "use strict";
    return this.actualMoves.some(function (move) {
        return move.source.equals(position);
    });
};

CHESS_APP.MoveResult.prototype.hasDestination = function (position) {
    "use strict";
    return this.actualMoves.some(function (move) {
        return move.destination.equals(position);
    });
};

CHESS_APP.MoveResult.prototype.isVerticalWithLengthOfTwo = function () {
    "use strict";
    return this.actualMoves.some(function (move) {
        return move.isVertical() && Math.abs(move.getVerticalMovement()) === 2;
    });
};

CHESS_APP.MoveResult.prototype.toString = function () {
    "use strict";
    return '{ ' + this.isLegal +
            ' ' + this.actualMoves +
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

    var move = this.actualMoves[0];

    return move.piece.getMoveNotationSymbol() +
            move.source.toString() +
            '-' + move.destination.toString();
};
