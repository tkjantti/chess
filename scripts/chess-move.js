/*jslint browser:true, fudge:true, this:true */
/*global window, $, CHESS_APP */

CHESS_APP.createMove = function (player, source, destination) {
    "use strict";

    var that = {
        player: player,
        source: source,
        destination: destination
    };

    that.toString = function () {
        return '{ ' + player + ' ' + source + ' -> ' + destination + ' }';
    };

    that.getRelativeVerticalMovement = function () {
        if (player === "white") {
            return source.row - destination.row;
        } else {
            return destination.row - source.row;
        }
    };

    that.getHorizontalMovement = function () {
        return destination.column - source.column;
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
