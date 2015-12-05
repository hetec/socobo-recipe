function ImageService(imageCooserId){

  var imageChooser = document.querySelector(imageCooserId);
  var data = "";

  this.encode = function (imageId) {
    alert(imageId);
    var file = imageChooser.files[0];
    if(file === undefined || file === null){
      data = "";
      build(imageId,"http://localhost:8080/components/socobo-recipe/placeholder.png");
    }else{
      var reader = new FileReader();
      reader.onload = function(e){
        data = e.target.result;
        alert("finished");
        build(imageId, data);
      }
      reader.readAsDataURL(file);
    }

  };

  this.getImageAsString = function(){
    return data;
  };

  var build = function (id, data) {
    id.src = data;
  }
}

