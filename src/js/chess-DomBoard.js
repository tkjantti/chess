
(function (exports) {
    "use strict";

    var getSquare = function (position) {
        return $("#square_" + position.row + "_" + position.column);
    };

    var getSquarePosition = function (square) {
        var stringCoordinates = square.attr("id").split("_");
        return new CHESS_APP.Point(parseInt(stringCoordinates[1], 10), parseInt(stringCoordinates[2], 10));
    };

    var getPieceImage = function (square) {
        var children = square.children("img");
        if (children.length === 0) {
            return null;
        }
        return children[0];
    };

    var getPlayerOf = function (piece) {
        if (piece.src.includes("black")) {
            return "black";
        }
        if (piece.src.includes("white")) {
            return "white";
        }
        return null;
    };

    var getTypeOf = function (piece) {
        var match = /[a-z]+_([a-z]+)\.svg/.exec(piece.src);
        return match[1];
    };

    var getSideSquares = function (player) {
        return $("#" + player + "CapturedPieces td");
    };

    var DomBoard = function () {
        CHESS_APP.Board.call(
            this,
            CHESS_APP.defaultRowCount,
            CHESS_APP.defaultColumnCount);
        this.initialized = false;
        this.selectedPosition = null;
        this.onSquareClicked = null;
    };

    DomBoard.prototype = Object.create(CHESS_APP.Board.prototype);
    DomBoard.prototype.constructor = CHESS_APP.Board;

    DomBoard.prototype.highlightPieceUnderThreat = function (position) {
        var square = getSquare(position);
        square.addClass("threat");
        window.setTimeout(function () {
            square.removeClass("threat");
        }, 1000);
    };

    DomBoard.prototype.getPiece = function (position) {
        var square, pieceImage;

        if (!this.isInside(position)) {
            return null;
        }

        square = getSquare(position);
        pieceImage = getPieceImage(square);

        if (!pieceImage) {
            return null;
        }

        return new CHESS_APP.Piece(getPlayerOf(pieceImage), getTypeOf(pieceImage));
    };

    DomBoard.prototype.changeTypeOfPiece = function (position, type) {
        var square = getSquare(position);
        var pieceImage = getPieceImage(square);
        var player = getPlayerOf(pieceImage);
        var elt = $(pieceImage);
        elt.attr('src', 'images/' + player + '_' + type + '.svg');
    };

    DomBoard.prototype.getPositionOf = function (piece) {
        var found = this.findPiece(function (currentPiece) {
            return currentPiece.equals(piece);
        });
        return found ? found.position : null;
    };

    DomBoard.prototype.findPiece = function (predicate, context) {
        var row, column, position, piece;

        for (row = 0; row < this.getRowCount(); row += 1) {
            for (column = 0; column < this.getColumnCount(); column += 1) {
                position = new CHESS_APP.Point(row, column);
                piece = this.getPiece(position);
                if (piece && predicate.call(context, piece, position)) {
                    return {
                        piece: piece,
                        position: position
                    };
                }
            }
        }
        return null;
    };

    DomBoard.prototype.findPieces = function (predicate) {
        var row, column, position, piece, pieces = [];

        for (row = 0; row < this.getRowCount(); row += 1) {
            for (column = 0; column < this.getColumnCount(); column += 1) {
                position = new CHESS_APP.Point(row, column);
                piece = this.getPiece(position);
                if (piece && predicate(piece, position)) {
                    pieces.push({
                        piece: piece,
                        position: position
                    });
                }
            }
        }
        return pieces;
    };

    DomBoard.prototype.getPieces = function () {
        return this.findPieces(function () {
            return true;
        });
    };

    DomBoard.prototype.selectSquare = function (position) {
        this.removeSelection();

        this.selectedPosition = position;
        var square = getSquare(position);
        square.addClass("selected");
    };

    DomBoard.prototype.removeSelection = function () {
        if (!this.selectedPosition) {
            return;
        }

        this.forEachPosition(function (p) {
            var square = getSquare(p);
            square.removeClass("selected");
        });
        this.selectedPosition = null;
    };

    DomBoard.prototype.removePiece = function (position) {
        var square = getSquare(position);
        var piece = this.getPiece(position);
        var pieceImage = getPieceImage(square);
        var freeSquare = getSideSquares(piece.player)
            .filter(function (ignore, element) {
                return $(element).children().length === 0;
            }).first();

        freeSquare.append(pieceImage);
    };

    DomBoard.prototype.move = function (source, destination) {
        var square = getSquare(source);
        var piece = getPieceImage(square);
        var destinationSquare = getSquare(destination);
        destinationSquare.append(piece);
    };

    DomBoard.prototype.clear = function () {
        $('td img').remove();
    };

    DomBoard.prototype.setPiece = function (position, piece) {
        if (position == null) {
            throw "position is null";
        }
        if (piece == null) {
            throw "piece is null";
        }

        var square = getSquare(position);
        var existingPiece = getPieceImage(square);
        var img = existingPiece ? $(existingPiece) : $('<img></img>');

        square.append(
            img.attr('src', 'images/' + piece.player + '_' + piece.type + '.svg'));
    };

    DomBoard.prototype.initialize = function () {
        var that = this;

        var addBoardClickHandlers = function () {
            $("#board td").click(function () {
                var square = $(this);
                var position = getSquarePosition(square);
                if (that.onSquareClicked) {
                    that.onSquareClicked(position, that.selectedPosition);
                }
            });
        };

        if (this.initialized) {
            return;
        }

        addBoardClickHandlers();
        this.initialized = true;
    };

    DomBoard.prototype.listenSquareClick = function (handler) {
        this.onSquareClicked = handler;
    };

    exports.DomBoard = DomBoard;
}(this.CHESS_APP = this.CHESS_APP || {}));
