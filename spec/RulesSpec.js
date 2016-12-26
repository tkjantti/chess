/*jslint fudge:true */
/*global window, describe, beforeEach, it, expect, CHESS_APP, CHESS_TEST */

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

    describe("isLegalMove", function () {
        var rules;

        beforeEach(function () {
            rules = CHESS_APP.createRules();
        });

        describe("Pawn", function () {
            it("can move forward one step", function () {
                var board = CHESS_TEST.boardState([
                    "   ",
                    "   ",
                    " P ",
                    "   "
                ]);

                var source = CHESS_APP.createPoint(2, 1);
                var destination = CHESS_APP.createPoint(1, 1);
                var result = rules.isLegalMove(board, source, destination);

                expect(result).toBe(true);
            });
            it("can move two steps from second row", function () {
                var board = CHESS_TEST.boardState([
                    "   ",
                    "   ",
                    " P ",
                    "   "
                ]);

                var source = CHESS_APP.createPoint(2, 1);
                var destination = CHESS_APP.createPoint(0, 1);
                var result = rules.isLegalMove(board, source, destination);

                expect(result).toBe(true);
            });
        });
    });
});
