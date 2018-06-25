
(function (exports) {
    "use strict";

    var initialized = false;
    var board = new CHESS_APP.DomBoard();
    var game = new CHESS_APP.Game(new CHESS_APP.Rules());

    function displayCurrentPlayer(player) {
        $('#gameStatusText').text("Player in turn: " + player);
    }

    function displayState(state) {
        switch (state) {
        case CHESS_APP.Game.STATE_CHECKMATE:
            $('#gameStatusText').text('Checkmate! Winner: ' + game.getCurrentPlayer());
            $('#gameStatus').addClass("victory");
            break;
        case CHESS_APP.Game.STATE_DRAW:
            $('#gameStatusText').text("Draw!");
            $('#gameStatus').addClass("draw");
            break;
        default:
            $('#gameStatus').removeClass();
            displayCurrentPlayer(game.getCurrentPlayer());
            break;
        }
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

        game.save();

        board.removeSelection();
    }

    exports.app = {
        initialize: function initialize() {
            if (initialized) {
                return;
            }

            board.initialize();
            board.listenSquareClick(onSquareClicked);

            game.listenCurrentPlayer(displayCurrentPlayer);
            game.listenState(displayState);
            game.moveLog.listenAdd(addMoveResultToList);
            game.load(board);

            initialized = true;
        }
    };
}(this.CHESS_APP = this.CHESS_APP || {}));
