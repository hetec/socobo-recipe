(function ImageService(){
  var testButton = document.querySelector('#testButton');
  var imageChooser = document.querySelector('#imageForm');

  var data;

  var encode = function () {
    var file = imageChooser.files[0];
    var reader = new FileReader();
    reader.onload = function(e){
      data = e.target.result;
    }
    reader.readAsDataURL(file);
  };

  this.getImageAsString = function(){
    alert(data);
  };

  imageChooser.addEventListener("change", function () {
    encode();
  });

  testButton.onclick = function () {
    getImageAsString();
  }
})();

