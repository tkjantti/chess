
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
    var piece = getPieceOnSquare(square);

    if (! selectedSquare) {
        if (piece && (getColor(piece) === currentPlayer)) {
            selectSquare(square);
        }
        return;
    }

    var selectedPiece = getPieceOnSquare(selectedSquare);
    var source = getSquarePosition(selectedSquare);
    var destination = getSquarePosition(square);
    
    if (square.attr("id") === selectedSquare.attr("id")) {
        removeSelection();
    } else if (piece && (getColor(piece) !== getColor(selectedPiece))) {
        if (! isLegalMove(getColor(selectedPiece), getType(selectedPiece), source, destination)) {
            return;
        }
        removeFromBoard(piece);
        move(square, selectedPiece);
        removeSelection();
        changePlayer();
    } else if (piece) {
        removeSelection();
        selectSquare(square);
    } else {
        if (! isLegalMove(getColor(selectedPiece), getType(selectedPiece), source, destination)) {
            return;
        }
        move(square, selectedPiece);
        removeSelection();
        changePlayer();
    }
}

function getSquarePosition(square) {
    var stringCoordinates = square.attr("id").split("_");
    return new Point(parseInt(stringCoordinates[1], 10), parseInt(stringCoordinates[2], 10));
}

function getType(piece) {
    var parts = piece.id.split("_");
    return parts[1];
}


function isLegalMove(color, type, source, destination) {
    if (! isInsideBoard(destination)) {
        return false;
    }
    
    var horizontal = getHorizontalMovement(source, destination);
    var vertical = getVerticalMovement(source, destination, color);

    switch (type) {
    case "pawn":
        var capturedPiece = getPiece(destination);
        var isFirstMove = getVerticalPosition(color, source) === 1;
        var isCorrectLengthForwardMove = (vertical === 1) || (isFirstMove && vertical === 2);
        
        if (horizontal === 0 && isCorrectLengthForwardMove && !capturedPiece) {
            return true;
        }

        if ((horizontal === -1 || horizontal === 1) && vertical === 1 && capturedPiece) {
            return true;
        }
        
        return false;

    case "bishop":
        return isDiagonalMove(horizontal, vertical);
        
    case "rook":
        return isHorizontalOrVerticalMove(horizontal, vertical);

    case "queen":
        return isDiagonalMove(horizontal, vertical) || isHorizontalOrVerticalMove(horizontal, vertical);
        
    case "king":
        return (Math.abs(horizontal) <= 1 && Math.abs(vertical) <= 1);
        
    default:
        return false;
    };
}

function isDiagonalMove(horizontalMovement, verticalMovement) {
    return (horizontalMovement != 0) && (Math.abs(horizontalMovement) === Math.abs(verticalMovement));
}

function isHorizontalOrVerticalMove(horizontalMovement, verticalMovement) {
    return (horizontalMovement === 0 || verticalMovement === 0);
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

    var square = $("#square_" + position.row + "_" + position.column);
    return getPieceOnSquare(square);
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
    var otherPlayer = (currentPlayer === "white") ? "black" : "white";
    setCurrentPlayer(otherPlayer);
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
    // TODO meneekö lisätty luokka varmasti vanhan luokan edelle
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

