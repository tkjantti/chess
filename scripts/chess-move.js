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

    that.getVerticalMovement = function () {
        if (player === "white") {
            return source.row - destination.row;
        } else {
            return destination.row - source.row;
        }
    };

    that.getHorizontalMovement = function () {
        return destination.column - source.column;
    };

    return that;
};
