/*jslint browser:true, fudge:true, this:true, for:true */
/*global window, $, CHESS_APP */

CHESS_APP.game = (function () {
    "use strict";
    var initialized = false;
    var currentPlayer = "white";
    var selectedPosition = null;
    var rules = CHESS_APP.createRules();
    var domBoard = null;

    function setCurrentPlayer(player) {
        currentPlayer = player;
        $("#player_in_turn").text(player);
    }

    var selectSquare = function (position) {
        domBoard.selectSquare(position);
        selectedPosition = position;
    };

    var removeSelection = function () {
        domBoard.removeSelection();
        selectedPosition = null;
    };

    var changePlayer = function () {
        setCurrentPlayer(rules.opponentPlayer(currentPlayer));
    };

    function onSquareClicked(position, piece) {
        var board, selectedPiece, pieceUnderThreat;

        board = CHESS_APP.cloneInMemoryBoard(domBoard);

        if (!selectedPosition) {
            if (piece && (piece.player === currentPlayer)) {
                selectSquare(position);
            }
            return;
        }

        if (position.equals(selectedPosition)) {
            removeSelection();
            return;
        }

        selectedPiece = board.getPiece(selectedPosition);

        if (piece && (piece.player === selectedPiece.player)) {
            removeSelection();
            selectSquare(position);
        }

        if (!rules.isLegalMove(board, selectedPosition, position)) {
            return;
        }

        board.move(selectedPosition, position);

        pieceUnderThreat = rules.isInCheck(board, currentPlayer);

        if (pieceUnderThreat) {
            domBoard.highlightPieceUnderThreat(pieceUnderThreat);
            return;
        }

        if (piece) {
            domBoard.removeFromBoard(position);
        }

        domBoard.move(selectedPosition, position);
        removeSelection();
        changePlayer();
    }

    return {
        initialize: function initialize() {
            if (initialized) {
                return;
            }

            domBoard = CHESS_APP.createDomBoard(onSquareClicked);
            setCurrentPlayer("white");
            initialized = true;
        }
    };
}());
