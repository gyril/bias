// Here I adjust the law followed by the die, so that after `iterations` number of casts, we have obtained as many of each outcome as what the initial law predicted
// Another way to modelize it would have been to fill an urn with `iterations` balls, and an amount of balls marked `x` equal to the number of expected `x` from the initial law, and then draw randomly from the urn

// browserified
(function () {

  // For a given probability law, returns the density on [0, 1]
  function getDensityFromLaw (law) {
    var density = [];

    for (var i in law) {
      var previousP = density.length ? density[density.length-1].p : 0;
      density.push({outcome: law[i].outcome, p: law[i].p + previousP})
    }

    return density;
  }

  // Prepares the `results` dictionary for a given law
  function seedResultsFromLaw (law) {
    var res = {};

    for (var i in law) {
      res[law[i].outcome] = 0;
    }

    return res;
  }

  // Draw a random number from [0, 1]
  function castDie (density) {
    var rnd = Math.random();
    return getOutcomeFromDensity(density, rnd);
  }

  // Returns the outcome associated with a draw on [0, 1]
  function getOutcomeFromDensity (density, rnd) {
    var i = 0;

    while (density[i].p < rnd) {
      i++;
    }

    return density[i].outcome;
  }

  // Returns an updated probability law that will bias the results towards the "fair" outcome after a number of iterations
  function generateNewDensityFromResults (law, results, iterations) {
    var n = 0;

    for (var i in results) {
      n += results[i];
    }

    var newLaw = [];

    for (var outcome in results) {
      var originalVariable = getVariableFromOutcome(law, outcome);
      var variable = {
        outcome: originalVariable.outcome,
        p: Math.max(0, (originalVariable.p * iterations - results[outcome]) / (iterations - n))
      };

      newLaw.push(variable);
    }

    return getDensityFromLaw(newLaw);
  }

  // util function to retrieve a variable in a law based on the outcome it should have
  function getVariableFromOutcome (law, outcome) {
    var i = 0,
        variable = law[i];

    while (variable.outcome != outcome) {
      variable = law[++i];
    }

    return variable;
  }

  // util function to retrieve the probability of a certain outcome from a given law
  function expectedProbaOfOutcome (law, outcome) {
    return getVariableFromOutcome(law, outcome).p;
  }

  // Computes the standard deviation of the results to the predicted outcomes of a given law
  function getStdDevFromResults (results, law) {
    var variance = 0;

    for (var i in results) {
      var distance = Math.pow((results[i] / iterations) - expectedProbaOfOutcome(law, i), 2);
      variance += distance;
    }

    return Math.sqrt(variance);
  }

  window.Bias = function (iterations) {
    // if no number of iterations is given, defaults to 36 +- 5
    var iterations = iterations || 36 + (5 - Math.floor(Math.random()*10));

    // this is the law for 2 dice (Catan)
    var law = [
        {outcome: 2, p: 1/36},
        {outcome: 3, p: 2/36},
        {outcome: 4, p: 3/36},
        {outcome: 5, p: 4/36},
        {outcome: 6, p: 5/36},
        {outcome: 7, p: 6/36},
        {outcome: 8, p: 5/36},
        {outcome: 9, p: 4/36},
        {outcome: 10, p: 3/36},
        {outcome: 11, p: 2/36},
        {outcome: 12, p: 1/36}
      ];

    var density = getDensityFromLaw(law);
    var results = seedResultsFromLaw(law);

    return {
      cast: function () {
        var number = castDie(density);
        results[number]++;
        density = generateNewDensityFromResults(law, results, iterations);
        return number;
      }
    }
  }

})();
