
(function (exports) {
    "use strict";

    var MoveLog = function () {
        this.moves = [];
    };

    MoveLog.prototype.add = function (moveResult) {
        this.moves.push(moveResult);
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

    MoveLog.prototype.serialize = function () {
        return this.moves.map(function (move) {
            return move.serialize();
        });
    };

    exports.MoveLog = MoveLog;
})(this.CHESS_APP = this.CHESS_APP || {});
