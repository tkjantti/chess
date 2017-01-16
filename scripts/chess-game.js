/*jslint browser:true, fudge:true, this:true */
/*global window, $, CHESS_APP */

CHESS_APP.game = (function () {
    "use strict";
    var initialized = false;
    var selectedPosition = null;
    var rules = CHESS_APP.createRules();
    var domBoard = null;

    var selectSquare = function (position) {
        domBoard.selectSquare(position);
        selectedPosition = position;
    };

    var removeSelection = function () {
        domBoard.removeSelection();
        selectedPosition = null;
    };

    function onSquareClicked(position) {
        var piece = domBoard.getPiece(position);

        if (!selectedPosition) {
            if (piece && (piece.player === rules.getPlayerInTurn())) {
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

        var result = rules.move(domBoard, selectedPosition, position);

        if (!result.success) {
            if (result.positionInCheck) {
                domBoard.highlightPieceUnderThreat(result.positionInCheck);
            }

            return;
        }

        removeSelection();
    }

    return {
        initialize: function initialize() {
            if (initialized) {
                return;
            }

            domBoard = CHESS_APP.createDomBoard(onSquareClicked);
            rules.listenPlayerInTurn(function (player) {
                $("#player_in_turn").text(player);
            });

            initialized = true;
        }
    };
}());
