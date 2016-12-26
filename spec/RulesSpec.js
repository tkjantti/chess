/*jslint fudge:true */
/*global window, CHESS_APP, describe, beforeEach, it, expect */

describe("Rules", function () {
    "use strict";
    describe("opponentPlayer", function () {
        var rules;

        beforeEach(function () {
            rules = CHESS_APP.createRules();
        });

        it("should return black when given white", function () {
            var opponent = rules.opponentPlayer("white");
            expect(opponent).toBe("black");
        });

        it("should return white when given black", function () {
            var opponent = rules.opponentPlayer("black");
            expect(opponent).toBe("white");
        });
    });

    // isLegalMove: function (board, piece, source, destination)
    describe("isLegalMove", function () {
        var board = boardState([
            "   ",
            "   ",
            "P  "
        ]);

        var position = CHESS_APP.createPosition(2, 0);
        var result = rules.isLegalMove(board, position, );
    });
});
