
(function (exports) {
    "use strict";

    var MOVE_LIST_IDENTIFIER = "chess-moves";

    var Storage = function () {
    };

    Storage.prototype.loadMoves = function () {
        var listAsString = localStorage.getItem(MOVE_LIST_IDENTIFIER);
        if (!listAsString) {
            return [];
        }

        return JSON.parse(listAsString);
    };

    Storage.prototype.saveMoves = function (moves) {
        localStorage.setItem(MOVE_LIST_IDENTIFIER, JSON.stringify(moves));
    };

    exports.Storage = Storage;
})(this.CHESS_APP = this.CHESS_APP || {});
