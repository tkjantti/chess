
(function (exports) {
    "use strict";

    var Move = function (source, destination) {
        this.source = source;
        this.destination = destination;
    };

    Move.prototype.toString = function () {
        return '{ ' + this.source + ' -> ' + this.destination + ' }';
    };

    Move.prototype.serialize = function () {
        return {
            from: this.source.toString(),
            to: this.destination.toString()
        };
    };

    Move.prototype.getVerticalMovement = function () {
        return this.destination.row - this.source.row;
    };

    Move.prototype.getHorizontalMovement = function () {
        return this.destination.column - this.source.column;
    };

    Move.prototype.isHorizontal = function () {
        return this.source.row === this.destination.row &&
            this.source.column !== this.destination.column;
    };

    Move.prototype.isVertical = function () {
        return this.source.column === this.destination.column &&
            this.source.row !== this.destination.row;
    };

    Move.prototype.isDiagonal = function () {
        return (this.source.row !== this.destination.row) &&
            Math.abs(this.destination.column - this.source.column) === Math.abs(this.destination.row - this.source.row);
    };

    var ActualMove = function (piece, source, destination) {
        Move.call(this, source, destination);
        this.piece = piece;
    };

    ActualMove.prototype = Object.create(Move.prototype);
    ActualMove.prototype.constructor = Move;

    ActualMove.prototype.toString = function () {
        return '{ ' + this.piece + ' ' + this.source + ' -> ' + this.destination + ' }';
    };

    exports.Move = Move;
    exports.ActualMove = ActualMove;
})(this.CHESS_APP = this.CHESS_APP || {});
