(function (){
  function RecipeDao (component){
    var that = component;

    var getUserURL = function (){
      var id = that.user.userId;
      return firebaseBaseUrl + "/" + id + "/Recipes";
    };
    this.getRecipes = function(){
      var dataRef = new Firebase(this.getUserUrl());
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
})();

