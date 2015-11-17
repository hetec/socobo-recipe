function ImageService(imageCooserId){
  var imageChooser = document.querySelector(imageCooserId);
  var data;
  this.encode = function () {
    var file = imageChooser.files[0];
    var reader = new FileReader();
    reader.onload = function(e){
      data = e.target.result;
      alert("finished");
    }
    reader.readAsDataURL(file);
  };

  this.getImageAsString = function(){
    return data;
  };

}

