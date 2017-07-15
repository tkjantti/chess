
var CHESS_APP = CHESS_APP || {};

CHESS_APP.Move = function (player, source, destination) {
    "use strict";
    this.player = player;
    this.source = source;
    this.destination = destination;
};

CHESS_APP.Move.prototype.toString = function () {
    "use strict";
    return '{ ' + this.player + ' ' + this.source + ' -> ' + this.destination + ' }';
};

CHESS_APP.Move.prototype.getRelativeVerticalMovement = function () {
    "use strict";
    if (this.player === "white") {
        return this.source.row - this.destination.row;
    } else {
        return this.destination.row - this.source.row;
    }
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
