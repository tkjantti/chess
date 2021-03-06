
(function (exports) {
    "use strict";
    
    var Point = function (row, column) {
        this.row = row;
        this.column = column;
    };

    Point.prototype.toString = function () {
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

    Point.fromString = function (str) {
        var columnCoordinate = str[0];
        var rowCoordinate = str[1];

        var getColumn = function (c) {
            switch (c) {
            case 'a':
                return 0;
            case 'b':
                return 1;
            case 'c':
                return 2;
            case 'd':
                return 3;
            case 'e':
                return 4;
            case 'f':
                return 5;
            case 'g':
                return 6;
            case 'h':
                return 7;
            default:
                return 0;
            }
        };

        var getRow = function (c) {
            return CHESS_APP.defaultRowCount - Number(c);
        };

        return new Point(getRow(rowCoordinate), getColumn(columnCoordinate));
    };

    Point.prototype.equals = function (other) {
        if (!other) {
            return false;
        }
        return this.row === other.row && this.column === other.column;
    };

    /*
     * Creates a new point with the given number of rows and
     * columns added to this point.
     */
    Point.prototype.add = function (rows, columns) {
        return new Point(this.row + rows, this.column + columns);
    };

    exports.Point = Point;
}(this.CHESS_APP = this.CHESS_APP || {}));
