# bias
A dice caster biased towards fair games.

The probability law is currently hard coded for Catan games. The code should be adapted for other games.


#### How to use
Initiate a new fair dice with `var dice = require('Bias')(n)`.
(`n` is the approximate number of rolls you will have in a game).

Roll the dice with `dice.cast()`.
