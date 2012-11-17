$(document).ready(function(){
	$("#slot").slot();

  $("#spin").on("click", function(event){
    $("#slot").slot("spin");
  });

  var characters = new OuterSpace.charactersScene(document.getElementById("characters"));

});
