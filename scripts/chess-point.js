/* global CHESS_APP */

CHESS_APP.Point = function (row, column) {
    "use strict";
    this.row = row;
    this.column = column;
};

CHESS_APP.Point.prototype.toString = function () {
    "use strict";
    var getColumnCoordinate = function (c) {
        switch (c) {
        case 0:
            return 'a';
        case 1:
            return 'b';
        case 2:
            return 'c';
        case 3:
            return 'd';
        case 4:
            return 'e';
        case 5:
            return 'f';
        case 6:
            return 'g';
        case 7:
            return 'h';
        default:
            return '?';
        }
    };

    var getRowCoordinate = function (r) {
        return CHESS_APP.defaultRowCount - r;
    };

    return getColumnCoordinate(this.column) + getRowCoordinate(this.row);
};

CHESS_APP.Point.prototype.equals = function (other) {
    "use strict";
    if (!other) {
        return false;
    }
    return this.row === other.row && this.column === other.column;
};

/*
 * Creates a new point with the given number of rows and
 * columns added to this point.
 */
CHESS_APP.Point.prototype.add = function (rows, columns) {
    "use strict";
    return new CHESS_APP.Point(this.row + rows, this.column + columns);
};
