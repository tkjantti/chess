/*jslint browser:true, fudge:true, this:true */
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

    function onSquareClicked(position) {
        var piece = domBoard.getPiece(position);

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

        var selectedPiece = domBoard.getPiece(selectedPosition);

        if (piece && (piece.player === selectedPiece.player)) {
            removeSelection();
            selectSquare(position);
        }

        var result = rules.move(domBoard, currentPlayer, selectedPosition, position);

        if (result.positionInCheck) {
            domBoard.highlightPieceUnderThreat(result.positionInCheck);
            return;
        }

        if (result.success) {
            removeSelection();
            changePlayer();
        }
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
