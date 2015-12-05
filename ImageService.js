function ImageService(imageCooserId){

  var imageChooser = document.querySelector(imageCooserId);
  var data;

  this.encode = function (imageId) {
    var file = imageChooser.files[0];
    var reader = new FileReader();
    reader.onload = function(e){
      data = e.target.result;
      alert("finished");
      build(imageId, data);
    }
    reader.readAsDataURL(file);
  };

  this.getImageAsString = function(){
    return data;
  };

  var build = function (id, data) {
    var img = document.createElement('img');
    img.style.height = '280px';
    img.style.width = '280px';
    img.src = data;
    id.innerHTML = img.outerHTML;
  }
}

