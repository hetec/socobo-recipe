function ImageService(imageChooserId){

  var imageChooser = document.querySelector(imageChooserId);
  var data = "";

  this.encode = function (imageId) {
    var file = imageChooser.files[0];
    if(file === undefined || file === null){
      data = "";
      this.build(imageId,"../placeholder.png");
    }else{
      var reader = new FileReader();
      reader.onload = function(e){
        data = e.target.result;
        this.build(imageId, data);
      }.bind(this);
      reader.readAsDataURL(file);
    }

  };

  this.getImageAsString = function(){
    return data;
  };

  this.build = function (id, data) {
    if(data !== null || data !== "" || data !== undefined){
      id.src = data;
    }
  }
}

