function ImageService(imageChooserId){

  var imageChooser = document.querySelector(imageChooserId);
  var data = "";

  var build = function (id, data) {
    if(data !== null || data !== "" || data !== undefined){
      id.src = data;
    }
  };

  this.encode = function (imageId) {
    var file = imageChooser.files[0];
    if(file === undefined || file === null){
      data = "";
      build(imageId,"placeholder.png");
    }else{
      var reader = new FileReader();
      reader.onload = function(e){
        data = e.target.result;
        build(imageId, data);
      };
      reader.readAsDataURL(file);
    }

  };

  this.getImageAsString = function(){
    return data;
  };
}

