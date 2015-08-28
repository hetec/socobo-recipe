function RecipeDao (component){
  var that = component;

  function getUserUrl(){
    var id = that.user.userId;
    return that.firebaseBaseUrl + "/" + id + "/Recipes";
  };

  this.getRecipes = function(){
    var dataRef = new Firebase(getUserUrl());
    dataRef.on("child_added", function(snapshot) {
      var p = new Promise(function(resolve, reject) {
        resolve(snapshot.val());
      }).then(function(val){
          console.log(val);
          that.push('recipes', val);
        })
    });
  }
}


