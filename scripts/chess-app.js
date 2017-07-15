/* jshint jquery:true */

var CHESS_APP = CHESS_APP || {};

CHESS_APP.app = (function () {
    "use strict";
    var initialized = false;
    var state = "match";
    var board = new CHESS_APP.DomBoard();
    var game = new CHESS_APP.Game(new CHESS_APP.Rules());

    function showVictory() {
        $('#gameState').text('Checkmate! Winner: ' + game.getCurrentPlayer());
        $('#gameState').addClass("victory");
    }

    function showDraw() {
        $('#gameState').text("Draw!");
        $('#gameState').addClass("draw");
    }

    function addMoveResultToList(moveResult) {
        if (moveResult.getPlayer() === "white") {
            $('#moves').find('tbody')
                .append($('<tr>')
                    .append($('<td>')
                        .text(moveResult.toString())
                    )
                );
        } else {
            $('#moves tr:last').append($('<td>')
                .text(moveResult.toString())
            );
        }
    }

    function onSquareClicked(position, previousPosition) {
        if (state === "finished") {
            return;
        }

        if (position.equals(previousPosition)) {
            board.removeSelection();
            return;
        }

        var piece = board.getPiece(position);

        if (piece && (piece.player === game.getCurrentPlayer())) {
            board.selectSquare(position);
            return;
        }

        if (!previousPosition) {
            return;
        }

        var result = game.move(board, previousPosition, position);

        if (!result.isGood()) {
            if (result.positionInCheck) {
                board.highlightPieceUnderThreat(result.positionInCheck);
            }

            return;
        }

        addMoveResultToList(result);

        if (result.isCheckMate()) {
            showVictory();
            state = "finished";
        } else if (result.isDraw()) {
            showDraw();
            state = "finished";
        }

        board.removeSelection();
    }

    return {
        initialize: function initialize() {
            if (initialized) {
                return;
            }

            board.initialize();
            board.listenSquareClick(onSquareClicked);

            game.listenCurrentPlayer(function (player) {
                $("#player_in_turn").text(player);
            });

            initialized = true;
        }
    };
}());
