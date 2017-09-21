/* jshint jquery:true */

var CHESS_APP = CHESS_APP || {};

CHESS_APP.app = (function () {
    "use strict";
    var initialized = false;
    var board = new CHESS_APP.DomBoard();
    var game = new CHESS_APP.Game(new CHESS_APP.Rules());

    function showVictory() {
        $('#gameStatusText').text('Checkmate! Winner: ' + game.getCurrentPlayer());
        $('#gameStatus').addClass("victory");
    }

    function showDraw() {
        $('#gameStatusText').text("Draw!");
        $('#gameStatus').addClass("draw");
    }

    function addMoveResultToList(moveResult) {
        var textNotation = moveResult.toMoveNotationString();

        if (moveResult.getPlayer() === "white") {
            $('#moves').find('tbody')
                .append($('<tr>')
                    .append($('<td>')
                        .text(textNotation)
                    )
                );
        } else {
            $('#moves tr:last').append($('<td>')
                .text(textNotation)
            );
        }
    }

    function onSquareClicked(position, previousPosition) {
        if (game.isFinished()) {
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

        if (!result.isLegal) {
            if (result.positionInCheck) {
                board.highlightPieceUnderThreat(result.positionInCheck);
            }

            return;
        }

        addMoveResultToList(result);

        if (game.isInCheckmate()) {
            showVictory();
        } else if (game.isInDraw()) {
            showDraw();
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
