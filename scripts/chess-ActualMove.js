
var CHESS_APP = CHESS_APP || {};

CHESS_APP.ActualMove = function (piece, source, destination) {
    "use strict";
    this.piece = piece;
    this.source = source;
    this.destination = destination;
};

CHESS_APP.ActualMove.prototype.toString = function () {
    "use strict";
    return '{ ' + this.piece + ' ' + this.source + ' -> ' + this.destination + ' }';
};
