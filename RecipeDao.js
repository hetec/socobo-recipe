function RecipeDao(component, userId) {
    var that = component;
    var id = userId;
    var userUrl = getUserUrl();

    function getUserUrl() {
      return that.url + "recipes/" + id;
    }

    this.addRecipe = function (obj) {
      var dataRef = new Firebase(userUrl);
      dataRef.push(obj, function (error) {
        if (error) {
          alert("Error while saving your data " + error);
        } else {
          console.log("Element created at: " + userUrl);
        }
      });
    };

    this.updateRecipe = function (obj) {
      var reference = "" + obj.ref + "";
      var newObj = {};
      for (var e in obj) {
        if (e != "ref" && e != "info") {
          newObj[e] = obj[e]
          console.log(newObj[e]);
        }
      }
      alert(reference);
      var dataRef = new Firebase(reference);
      dataRef.set(newObj, function (error) {
        if (error) {
          alert("Error while saving your data " + error);
        } else {
          console.log("Element created at: " + userUrl);
        }
      });
      that.recipes = [];
    };

    this.getAllRecipes = function(obj){
      var dataRef = new Firebase(userUrl);
      dataRef.once("value", function (snapshot) {
        var val = snapshot.val();
        for(e in val){

          var recipe = {};
          alert("SNAP REF: " + e);
          recipe.ref = snapshot.ref() + "/" + e;
          recipe.desc = val[e].desc;
          recipe.info = val[e].info;
          recipe.ingredients = [];
          recipe.steps = [];
          recipe.text = val[e].text;
          for (var k in val[e].ingredients) {
            recipe.ingredients.push(val[e].ingredients[k])
          }
          for (var j in val[e].steps) {
            recipe.steps.push(val[e].steps[j])
          }
          that.push("recipes", recipe);
        }
      })
    }

    this.getAndUpdateRecipes = function () {
      console.log("getAndUpdateRecipes called");
      var dataRef = new Firebase(userUrl);
      dataRef.on("child_added", function (snapshot) {
        console.log("CHILD ADDED --> UPDATE VIEW");
        var p = new Promise(function (resolve, reject) {
          resolve(snapshot.val());
        }).then(function (val) {
          var recipe = {};
          recipe.ref = snapshot.ref();
          recipe.desc = val.desc;
          recipe.info = val.info;
          recipe.ingredients = [];
          recipe.steps = [];
          recipe.text = val.text;
          for (var k in val.ingredients) {
            recipe.ingredients.push(val.ingredients[k])
          }
          for (var j in val.steps) {
            recipe.steps.push(val.steps[j])
          }
          console.log("IN ADD AND UPDATE");
          console.log(recipe);
          that.push('recipes', recipe);
        }).catch(function (err) {
          console.log(err);
        });
      }, function (err) {
        console.log(err);
      });
    };

    this.removeAndUpdateRecipe = function (obj, succ, err) {
      if (typeof succ === 'undefined') {
        succ = function () {
          console.log('Synchronization succeeded');
        }
      }
      if (typeof err === 'undefined') {
        err = function () {
          console.log('Synchronization failed');
        }
      }
      if (typeof succ !== 'function') {
        throw "The callback for success in removeRecipe() is not a function";
      }
      if (typeof err !== 'function') {
        throw "The callback for errors in removeRecipe() is not a function";
      }
      obj.ref.remove(function (error) {
        if (error) {
          err();
        } else {
          succ();
        }
      });
    };

    function updateAfterDeletion(el, arr, pathToProperty) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].ref == el.ref) {
          that.splice(pathToProperty, i, 1);
        }
      }
    }
}







