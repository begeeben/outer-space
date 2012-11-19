$(document).ready(function(){
	$("#slot").slot();

  $("#spin").on("click", function(event){
    $("#slot").slot("testSpin");
  });

  $("#max-bet").on("click", function(event){
    $("#slot").slot("testWins");
  });

  // var characters = new OuterSpace.charactersScene(document.getElementById("characters"));

});
