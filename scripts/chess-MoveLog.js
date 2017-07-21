
var CHESS_APP = CHESS_APP || {};

CHESS_APP.MoveLog = function () {
    "use strict";
    this.moves = [];
};

CHESS_APP.MoveLog.prototype.add = function (moveResult) {
    "use strict";
    this.moves.push(moveResult);
};

CHESS_APP.MoveLog.prototype.isEmpty = function () {
    "use strict";
    return this.moves.length === 0;
};

CHESS_APP.MoveLog.prototype.getLast = function () {
    "use strict";
    return this.moves[this.moves.length - 1];
};
