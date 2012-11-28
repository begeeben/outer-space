var eventAggregator;

$(document).ready(function(){

  eventAggregator = _.extend({}, Backbone.Events);

	$("#slot").slot({eventAggregator: eventAggregator});

  $("#spin").on("click", function(event){
    $("#slot").slot("testSpin");
  });

  $("#max-bet").on("click", function(event){
    $("#slot").slot("testWins");
  });

  var audio = new OuterSpace.audio("audio/", eventAggregator);
  var space = new OuterSpace.spaceScene(document.getElementById("background"));
  var characters = new OuterSpace.charactersScene(document.getElementById("characters"), eventAggregator);

  eventAggregator.trigger("game:ready");

});
