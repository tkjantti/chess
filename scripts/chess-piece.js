/*jslint browser:true, fudge:true, this:true */
/*global window, $, CHESS_APP */

CHESS_APP.createPiece = function (player, type) {
    "use strict";

    var symbolMap = {
        "pawn": "p",
        "rook": "r",
        "knight": "n",
        "bishop": "b",
        "queen": "q",
        "king": "k"
    };

    return {
        player: player,
        type: type,

        equals: function (another) {
            return another.player === this.player && another.type === this.type;
        },

        toString: function () {
            var symbol = symbolMap[this.type];
            if (player === "white") {
                return symbol.toUpperCase();
            } else {
                return symbol;
            }
        }
    };
};
