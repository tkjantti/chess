# Chess

A simple HTML chess game, meant just for learning Javascript programming. Rules are mostly covered, but for example draw rule is not complete. There is no AI at the moment.

The game is playable at
https://tkjantti.github.io/chess/

## Developing

Bower is needed for installing dependencies. If you don't have it, install it with

    $ npm install -g bower

Then

    $ npm install
    $ bower install

Note: if you don't have gulp 3.X installed globally, you can run gulp in the project directory with `./node_modules/.bin/gulp` instead of `gulp` in the commands below.

The Firefox browser is required for running unit tests. Run tests with

    $ gulp test

Running the game in the browser with Browsersync:

    $ gulp

Deployment:

    $ gulp deploy

## Copyright

Copyright © [Tero Jäntti](https://github.com/tkjantti) under the MIT licence.

Chess piece images © Colin M.L. Burnett, triple licensed under the [GFDL](https://www.gnu.org/licenses/fdl.html), BSD  and GPL licences.
