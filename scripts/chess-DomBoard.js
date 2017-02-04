/*jslint browser:true, fudge:true, this:true, for:true */
/*global window, $, CHESS_APP */

CHESS_APP.createDomBoard = function () {
    "use strict";
    var initialized = false;
    var selectedPosition = null;
    var onSquareClicked = null;

    var getSquare = function (position) {
        return $("#square_" + position.row + "_" + position.column);
    };

    var getSquarePosition = function (square) {
        var stringCoordinates = square.attr("id").split("_");
        return CHESS_APP.createPoint(parseInt(stringCoordinates[1], 10), parseInt(stringCoordinates[2], 10));
    };

    var getPieceImage = function (square) {
        var children = square.children("img");
        if (children.length === 0) {
            return null;
        }
        return children[0];
    };

    var getPlayerOf = function (piece) {
        if (piece.id.includes("black")) {
            return "black";
        }
        if (piece.id.includes("white")) {
            return "white";
        }
        return null;
    };

    var getTypeOf = function (piece) {
        var parts = piece.id.split("_");
        return parts[1];
    };

    var getSideSquares = function (player) {
        return $("#" + player + "_pieces td");
    };

    var addBoardClickHandlers = function () {
        $("#board td").click(function () {
            var square = $(this);
            var position = getSquarePosition(square);
            if (onSquareClicked) {
                onSquareClicked(position, selectedPosition);
            }
        });
    };

    var setStartingPositions = function () {
        $("#square_0_0").append($("#black_rook_1"));
        $("#square_0_1").append($("#black_knight_1"));
        $("#square_0_2").append($("#black_bishop_1"));
        $("#square_0_3").append($("#black_queen"));
        $("#square_0_4").append($("#black_king"));
        $("#square_0_5").append($("#black_bishop_2"));
        $("#square_0_6").append($("#black_knight_2"));
        $("#square_0_7").append($("#black_rook_2"));

        $("#square_1_0").append($("#black_pawn_1"));
        $("#square_1_1").append($("#black_pawn_2"));
        $("#square_1_2").append($("#black_pawn_3"));
        $("#square_1_3").append($("#black_pawn_4"));
        $("#square_1_4").append($("#black_pawn_5"));
        $("#square_1_5").append($("#black_pawn_6"));
        $("#square_1_6").append($("#black_pawn_7"));
        $("#square_1_7").append($("#black_pawn_8"));

        $("#square_6_0").append($("#white_pawn_1"));
        $("#square_6_1").append($("#white_pawn_2"));
        $("#square_6_2").append($("#white_pawn_3"));
        $("#square_6_3").append($("#white_pawn_4"));
        $("#square_6_4").append($("#white_pawn_5"));
        $("#square_6_5").append($("#white_pawn_6"));
        $("#square_6_6").append($("#white_pawn_7"));
        $("#square_6_7").append($("#white_pawn_8"));

        $("#square_7_0").append($("#white_rook_1"));
        $("#square_7_1").append($("#white_knight_1"));
        $("#square_7_2").append($("#white_bishop_1"));
        $("#square_7_3").append($("#white_queen"));
        $("#square_7_4").append($("#white_king"));
        $("#square_7_5").append($("#white_bishop_2"));
        $("#square_7_6").append($("#white_knight_2"));
        $("#square_7_7").append($("#white_rook_2"));
    };

    var that = CHESS_APP.createBoard();

    that.highlightPieceUnderThreat = function (position) {
        var square = getSquare(position);
        square.addClass("threat");
        window.setTimeout(function () {
            square.removeClass("threat");
        }, 1000);
    };

    that.getPiece = function (position) {
        var square, pieceImage;

        if (!this.isInside(position)) {
            return null;
        }

        square = getSquare(position);
        pieceImage = getPieceImage(square);

        if (!pieceImage) {
            return null;
        }

        return CHESS_APP.createPiece(getPlayerOf(pieceImage), getTypeOf(pieceImage));
    };

    that.changeTypeOfPiece = function (position, type) {
        var square = getSquare(position);
        var pieceImage = getPieceImage(square);
        var player = getPlayerOf(pieceImage);
        var elt = $(pieceImage);
        elt.attr('src', 'images/' + player + '_' + type + '.svg');
        elt.attr('id', player + '_' + type);
    };

    that.getPositionOf = function (piece) {
        var found = this.findPiece(function (currentPiece) {
            return currentPiece.equals(piece);
        });
        return found
            ? found.position
            : null;
    };

    that.findPiece = function (predicate) {
        var row, column, position, piece;

        for (row = 0; row < this.getRowCount(); row += 1) {
            for (column = 0; column < this.getColumnCount(); column += 1) {
                position = CHESS_APP.createPoint(row, column);
                piece = this.getPiece(position);
                if (piece && predicate(piece, position)) {
                    return {
                        piece: piece,
                        position: position
                    };
                }
            }
        }
        return null;
    };

    that.findPieces = function (predicate) {
        var row, column, position, piece, pieces = [];

        for (row = 0; row < this.getRowCount(); row += 1) {
            for (column = 0; column < this.getColumnCount(); column += 1) {
                position = CHESS_APP.createPoint(row, column);
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

    that.selectSquare = function (position) {
        this.removeSelection();

        selectedPosition = position;
        var square = getSquare(position);
        square.addClass("selected");
    };

    that.removeSelection = function () {
        if (!selectedPosition) {
            return;
        }

        this.forEachPosition(function (p) {
            var square = getSquare(p);
            square.removeClass("selected");
        });
        selectedPosition = null;
    };

    that.removePiece = function (position) {
        var square = getSquare(position);
        var piece = this.getPiece(position);
        var pieceImage = getPieceImage(square);
        var freeSquare = getSideSquares(piece.player)
            .filter(function (ignore, element) {
                return $(element).children().length === 0;
            }).first();

        freeSquare.append(pieceImage);
    };

    that.move = function (source, destination) {
        var square = getSquare(source);
        var piece = getPieceImage(square);
        var destinationSquare = getSquare(destination);
        destinationSquare.append(piece);
    };

    that.initialize = function () {
        if (initialized) {
            return;
        }
        setStartingPositions();
        addBoardClickHandlers();
        initialized = true;
    };

    that.listenSquareClick = function (handler) {
        onSquareClicked = handler;
    };

    return that;
};
