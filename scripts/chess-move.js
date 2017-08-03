
var CHESS_APP = CHESS_APP || {};

CHESS_APP.Move = function (source, destination) {
    "use strict";
    this.source = source;
    this.destination = destination;
};

CHESS_APP.Move.prototype.toString = function () {
    "use strict";
    return '{ ' + this.source + ' -> ' + this.destination + ' }';
};

CHESS_APP.Move.prototype.getVerticalMovement = function () {
    "use strict";
    return this.destination.row - this.source.row;
};

CHESS_APP.Move.prototype.getHorizontalMovement = function () {
    "use strict";
    return this.destination.column - this.source.column;
};

CHESS_APP.Move.prototype.isHorizontal = function () {
    "use strict";
    return this.source.row === this.destination.row &&
            this.source.column !== this.destination.column;
};

CHESS_APP.Move.prototype.isVertical = function () {
    "use strict";
    return this.source.column === this.destination.column &&
            this.source.row !== this.destination.row;
};

CHESS_APP.Move.prototype.isDiagonal = function () {
    "use strict";
    return (this.source.row !== this.destination.row) &&
            Math.abs(this.destination.column - this.source.column) === Math.abs(this.destination.row - this.source.row);
};

CHESS_APP.ActualMove = function (piece, source, destination) {
    "use strict";
    CHESS_APP.Move.call(this, source, destination);
    this.piece = piece;
};

CHESS_APP.ActualMove.prototype = Object.create(CHESS_APP.Move.prototype);
CHESS_APP.ActualMove.prototype.constructor = CHESS_APP.Move;
