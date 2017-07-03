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

    var moveNotationSymbolMap = {
        "pawn": "P",
        "rook": "R",
        "knight": "N",
        "bishop": "B",
        "queen": "Q",
        "king": "K"
    };

    if (!symbolMap[type]) {
        throw "Unknown piece type " + type;
    }

    return {
        player: player,
        type: type,

        equals: function (another) {
            return another.player === this.player && another.type === this.type;
        },

        getMoveNotationSymbol: function () {
            return moveNotationSymbolMap[this.type];
        },

        /*
         * Prints the piece as a single character for testing and debugging.
         */
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
