function ImageService(imageCooserId){
  var imageChooser = document.querySelector(imageCooserId);
  alert(imageChooser);
  var data;
  this.encode = function () {
    var file = imageChooser.files[0];
    alert("file: " + file.name);
    var reader = new FileReader();
    reader.onload = function(e){
      data = e.target.result;
      alert("finished");
    }
    reader.onloadstart = function(e){
      alert("start");
    }
    reader.readAsDataURL(file);
  };

  this.getImageAsString = function(){
    alert("Data: " + data);
  };

}

