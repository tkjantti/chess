
(function (exports) {
    "use strict";

    var MoveLog = function () {
        this.moves = [];
        this.onMoveAddedHandler = null;
        this.onClearedHandler = null;
    };

    MoveLog.prototype.add = function (moveResult) {
        this.moves.push(moveResult);
        if (this.onMoveAddedHandler) {
            this.onMoveAddedHandler(moveResult);
        }
    };

    MoveLog.prototype.listenAdd = function (onMoveAdded) {
        this.onMoveAddedHandler = onMoveAdded;
    };

    MoveLog.prototype.listenClear = function (onCleared) {
        this.onClearedHandler = onCleared;
    };

    MoveLog.prototype.isEmpty = function () {
        return this.moves.length === 0;
    };

    MoveLog.prototype.getLast = function () {
        return this.moves[this.moves.length - 1];
    };

    MoveLog.prototype.hasAnyPieceMovedFrom = function (position) {
        return this.moves.some(function (moveResult) {
            return moveResult.hasSource(position);
        });
    };

    MoveLog.prototype.clear = function () {
        this.moves = [];
        if (this.onClearedHandler) {
            this.onClearedHandler();
        }
    };

    MoveLog.prototype.serializeMoves = function () {
        return this.moves.map(function (move) {
            return move.serialize();
        });
    };

    MoveLog.deserializeMoves = function (json) {
        return json.map(function (move) {
            return CHESS_APP.Move.deserialize(move);
        });
    };

    exports.MoveLog = MoveLog;
})(this.CHESS_APP = this.CHESS_APP || {});
