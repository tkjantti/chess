
(function (exports) {
    "use strict";
    
    var MoveResult = function (isLegal, actualMoves, positionInCheck, castling) {
        if (isLegal && (!actualMoves || actualMoves.length === 0)) {
            throw "At least one actual move expected";
        }

        this.isLegal = isLegal;
        this.actualMoves = (actualMoves ? actualMoves : []);
        this.positionInCheck = positionInCheck;
        this.castling = (castling ? castling : CHESS_APP.CASTLING_NONE);
    };

    MoveResult.prototype.getPlayer = function () {
        var move = this.actualMoves[0];
        return move.piece.player;
    };

    MoveResult.prototype.hasSource = function (position) {
        return this.actualMoves.some(function (move) {
            return move.source.equals(position);
        });
    };

    MoveResult.prototype.hasDestination = function (position) {
        return this.actualMoves.some(function (move) {
            return move.destination.equals(position);
        });
    };

    MoveResult.prototype.isVerticalWithLengthOfTwo = function () {
        return this.actualMoves.some(function (move) {
            return move.isVertical() && Math.abs(move.getVerticalMovement()) === 2;
        });
    };

    MoveResult.prototype.toString = function () {
        return '{ ' + this.isLegal +
            ' ' + this.actualMoves +
            ' ' + this.positionInCheck +
            ' ' + this.castling +
            ' }';
    };

    MoveResult.prototype.toMoveNotationString = function () {
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

    exports.MoveResult = MoveResult;
})(this.CHESS_APP = this.CHESS_APP || {});
