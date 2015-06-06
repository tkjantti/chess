
if (!String.prototype.includes) {
  String.prototype.includes = function() {'use strict';
    return String.prototype.indexOf.apply(this, arguments) !== -1;
  };
}


var currentPlayer = "white";
var selectedSquare = null;


jQuery(document).ready(function() {
    addBoardClickHandlers();
    setStartingPositions();
    setCurrentPlayer("white");
});

function Point(row, column) {
    this.row = row;
    this.column = column;
}

function Piece(color, type) {
    this.color = color;
    this.type = type;
}

Piece.prototype.equals = function(another) {
    return another.color === this.color && another.type === this.type; 
};

function PieceAtPosition(piece, position) {
    this.piece = piece;
    this.position = position;
}

function Board() {
    this.rowCount = 8;
    this.columnCount = 8;
    this.rows = [
        new Array(this.columnCount),
        new Array(this.columnCount),
        new Array(this.columnCount),
        new Array(this.columnCount),
        new Array(this.columnCount),
        new Array(this.columnCount),
        new Array(this.columnCount),
        new Array(this.columnCount)
    ];
}

Board.prototype.getPiece = function (position) {
    return this.rows[position.row][position.column];
};

Board.prototype.setPiece = function (position, piece) {
    this.rows[position.row][position.column] = piece;
};

Board.prototype.getPositionOf = function (piece) {
    var found = this.findPiece(function (currentPiece, position) {
        return currentPiece.equals(piece);
    });
    return (found ? found.position : null);
};

Board.prototype.findPiece = function (predicate) {
    for (var row = 0; row < this.rowCount; row++) {
        for (var column = 0; column < this.columnCount; column++) {
            var position = new Point(row, column);
            var piece = this.getPiece(position);
            if (piece && predicate(piece, position)) {
                return new PieceAtPosition(piece, position);
            }
        }
    }
    return null;
};

Board.prototype.move = function (source, destination) {
    var piece = this.getPiece(source);
    if (!piece) {
        console.log("Board.move: piece expected in source");
    }
    this.setPiece(source, null);
    this.setPiece(destination, piece);
};

function createBoardFromPage() {
    var board = new Board();

    for (var row = 0; row < board.rowCount; row++) {
        for (var column = 0; column < board.columnCount; column++) {
            var position = new Point(row, column);
            var piece = getPiece(position);
            if (piece) {
                board.rows[row][column] = new Piece(getColor(piece), getType(piece));
            }
        }
    }

    return board;
}

function setStartingPositions() {
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
}

function setCurrentPlayer(color) {
    currentPlayer = color;
    $("#player_in_turn").text(color);
}


function addBoardClickHandlers() {
    $("#board td").click(function() {
        onSquareClicked($(this));
    });
    $("#black_pieces td").click(function() {
        onSquareClicked($(this));
    })
    $("#white_pieces td").click(function() {
        onSquareClicked($(this));
    })
}

function onSquareClicked(square) {
    var position = getSquarePosition(square);
    var board = createBoardFromPage();
    var piece = board.getPiece(position);

    if (! selectedSquare) {
        if (piece && (piece.color === currentPlayer)) {
            selectSquare(square);
        }
        return;
    }

    if (square.attr("id") === selectedSquare.attr("id")) {
        removeSelection();
        return;
    }

    var selectedPosition = getSquarePosition(selectedSquare);
    var selectedPiece = board.getPiece(selectedPosition);

    if (piece && (piece.color === selectedPiece.color)) {
        removeSelection();
        selectSquare(square);
    }

    if (! isLegalMove(board, selectedPiece, selectedPosition, position)) {
        return;
    }
    
    board.move(selectedPosition, position);
    
    if (isInCheck(board, currentPlayer)) {
        var positionOfKing = board.getPositionOf(new Piece(currentPlayer, "king"));
        highlightPieceUnderThreat(positionOfKing);
        return;
    }

    if (piece) {
        removeFromBoard(getPieceOnSquare(square));
    }

    move(square, getPieceOnSquare(selectedSquare));
    removeSelection();
    changePlayer();
}

function highlightPieceUnderThreat(position) {
    var square = getSquare(position);
    square.addClass("threat");
    window.setTimeout(function () {
        square.removeClass("threat");
    }, 1000);
}

function getSquarePosition(square) {
    var stringCoordinates = square.attr("id").split("_");
    return new Point(parseInt(stringCoordinates[1], 10), parseInt(stringCoordinates[2], 10));
}

function getType(piece) {
    var parts = piece.id.split("_");
    return parts[1];
}

function isInCheck(board, currentPlayer) {
    var opponent = opponentPlayer(currentPlayer);
    var positionOfKing = board.getPositionOf(new Piece(currentPlayer, "king"));
    var attackingPiece = board.findPiece(function (piece, position) {
        return (piece.color === opponent) && isLegalMove(board, piece, position, positionOfKing);
    });
    return attackingPiece;
}

function isLegalMove(board, piece, source, destination) {
    if (! isInsideBoard(destination)) {
        return false;
    }

    var pieceAtDestination = board.getPiece(destination);
    if (pieceAtDestination && pieceAtDestination.color === piece.color) {
        return false;
    }
    
    var horizontal = getHorizontalMovement(source, destination);
    var vertical = getVerticalMovement(source, destination, piece.color);

    switch (piece.type) {
    case "pawn":
        var isFirstMove = getVerticalPosition(piece.color, source) === 1;
        var isCorrectLengthForwardMove = (vertical === 1) || (isFirstMove && vertical === 2);
        
        if (isCorrectLengthForwardMove && isVerticalMove(board, source, destination) && !pieceAtDestination) {
            return true;
        }

        if ((horizontal === -1 || horizontal === 1) && vertical === 1 && pieceAtDestination) {
            return true;
        }
        
        return false;

    case "knight":
        return (Math.abs(horizontal) === 1 && Math.abs(vertical) === 2)
            || (Math.abs(horizontal) === 2 && Math.abs(vertical) === 1);

    case "bishop":
        return isDiagonalMove(board, source, destination);
        
    case "rook":
        return isHorizontalMove(board, source, destination) || isVerticalMove(board, source, destination);

    case "queen":
        return isDiagonalMove(board, source, destination)
            || isHorizontalMove(board, source, destination)
            || isVerticalMove(board, source, destination);
        
    case "king":
        return (Math.abs(horizontal) <= 1 && Math.abs(vertical) <= 1);
        
    default:
        console.log("unknown piece type: " + piece.type);
        return false;
    };
}

function isDiagonalMove(board, source, destination) {
    if (source.row === destination.row) {
        return false;
    }

    if (Math.abs(destination.column - source.column) != Math.abs(destination.row - source.row)) {
        return false;
    }

    var leftmostPoint = (source.column < destination.column) ? source : destination;
    var rightmostPoint = (source.column > destination.column) ? source : destination;
    var rowStep = (rightmostPoint.row > leftmostPoint.row) ? 1 : -1;

    for (var r = leftmostPoint.row + rowStep, c = leftmostPoint.column + 1;
         c < rightmostPoint.column;
         r += rowStep, c++)
    {
        if (board.getPiece(new Point(r, c))) {
            return false;
        }
    }

    return true;
}

function isHorizontalMove(board, source, destination) {
    if (source.row != destination.row) {
        return false;
    }

    var min = Math.min(source.column, destination.column);
    var max = Math.max(source.column, destination.column);

    for (var i = min + 1; i < max; i++) {
        if (board.getPiece(new Point(source.row, i))) {
            return false;
        }
    }

    return true;
}

function isVerticalMove(board, source, destination) {
    if (source.column != destination.column) {
        return false;
    }

    var min = Math.min(source.row, destination.row);
    var max = Math.max(source.row, destination.row);

    for (var i = min + 1; i < max; i++) {
        if (board.getPiece(new Point(i, source.column))) {
            return false;
        }
    }

    return true;
}


function getVerticalPosition(color, position) {
    if (color === "white") {
        return 7 - position.row;
    } else {
        return position.row;
    }
}

function isInsideBoard(position) {
    return (0 <= position.row) && (position.row < 8) && (0 <= position.column) && (position.column < 8);
}

function getPiece(position) {
    if (! isInsideBoard(position)) {
        return null;
    }

    var square = getSquare(position);
    return getPieceOnSquare(square);
}

function getSquare(position) {
    return $("#square_" + position.row + "_" + position.column);
}

function getHorizontalMovement(source, destination) {
    return destination.column - source.column;
}

function getVerticalMovement(source, destination, color) {
    if (color === "white") {
        return source.row - destination.row;
    } else {
        return destination.row - source.row;
    }
}


function changePlayer() {
    setCurrentPlayer(opponentPlayer(currentPlayer));
}

function opponentPlayer(player) {
    return (player === "white") ? "black" : "white";
}

function move(square, piece) {
    square.append(piece);
}

function removeFromBoard(piece) {
    var freeSquare = getSideSquares(piece)
        .filter(function(index, element) {
            return $(element).children().length === 0;
        }).first();
    
    freeSquare.append(piece);
}

function getSideSquares(piece) {
    return $("#" + getColor(piece) + "_pieces td");
}


function getColor(piece) {
    if (piece.id.includes("black")) {
        return "black";
    }
    if (piece.id.includes("white")) {
        return "white";
    }
    return null;
}

function selectSquare(square) {
    square.addClass("selected");
    selectedSquare = square;
}

function removeSelection() {
    selectedSquare.removeClass("selected");
    selectedSquare = null;
}

function getPieceOnSquare(square) {
    var children = square.children("img");
    if (children.length === 0) {
        return null;
    }
    return children[0];
}

