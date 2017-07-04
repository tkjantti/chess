/* global CHESS_APP */

CHESS_APP.createMove = function (player, source, destination) {
    "use strict";

    var that = {
        player: player,
        source: source,
        destination: destination
    };

    that.toString = function () {
        return '{ ' + this.player + ' ' + this.source + ' -> ' + this.destination + ' }';
    };

    that.getRelativeVerticalMovement = function () {
        if (player === "white") {
            return this.source.row - this.destination.row;
        } else {
            return this.destination.row - this.source.row;
        }
    };

    that.getHorizontalMovement = function () {
        return this.destination.column - this.source.column;
    };

    that.isHorizontal = function () {
        return this.source.row === this.destination.row &&
                this.source.column !== this.destination.column;
    };

    that.isVertical = function () {
        return this.source.column === this.destination.column &&
                this.source.row !== this.destination.row;
    };

    that.isDiagonal = function () {
        return (this.source.row !== this.destination.row) &&
                Math.abs(this.destination.column - this.source.column) === Math.abs(this.destination.row - this.source.row);
    };

    return that;
};
