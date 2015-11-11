var RecipeDao = (function(){
  function RecipeDao(component, userId){
    var that = component;
    var id = userId;
    var userUrl = getUserUrl();

    function getUserUrl(){
      return that.url + "recipes/" + id;
    }

    this.addRecipe = function(obj){
      var dataRef = new Firebase(userUrl);
      dataRef.push(obj, function(error){
        if (error) {
          alert("Error while saving your data " + error);
        } else {
          console.log("Element created at: " + userUrl);
        }
      });
    };

    this.updateRecipe = function(obj){
      var reference = "" + obj.ref + "";
      var newObj = {};
      for(var e in obj){
        if(e != "ref" && e != "info"){
          newObj[e] = obj[e]
          console.log(newObj[e]);
        }
      }
      var dataRef = new Firebase(reference);
      dataRef.set(newObj, function(error){
        if (error) {
          alert("Error while saving your data " + error);
        } else {
          console.log("Element created at: " + userUrl);
        }
      });
    };

    this.getAndUpdateRecipes = function(){
      var dataRef = new Firebase(userUrl);
      dataRef.on("child_added", function(snapshot) {
        var p = new Promise(function(resolve, reject) {
          resolve(snapshot.val());
        }).then(function(val){
            var recipe = {};
            recipe.ref = snapshot.ref();
            recipe.desc = val.desc;
            recipe.info = val.info;
            recipe.ingredients = [];
            recipe.steps = [];
            recipe.text = val.text;
            for(var k in val.ingredients){
              recipe.ingredients.push(val.ingredients[k])
            }
            for(var j in val.steps){
              recipe.steps.push(val.steps[j])
            }
            console.log("Desc: " + recipe.desc + ", info: " + recipe.info + ", ref: " + recipe.ref);
            that.push('recipes', recipe);
          }).catch(function(err){
            console.log(err);
          });
      }, function(err){
        console.log(err);
      });
    };

    this.removeAndUpdateRecipe = function(obj, succ, err) {
      if (typeof succ === 'undefined') { succ = function(){
        console.log('Synchronization succeeded');
      }
      }
      if (typeof err === 'undefined') { err = function(){
        console.log('Synchronization failed');
      }
      }
      if(typeof succ !== 'function'){
        throw "The callback for success in removeRecipe() is not a function";
      }
      if(typeof err !== 'function'){
        throw "The callback for errors in removeRecipe() is not a function";
      }
      obj.ref.remove(function (error) {
        if (error) {
          err();
        } else {
          updateAfterDeletion(obj, that.recipes, 'recipes');
          succ();

        }
      });
    };

    function updateAfterDeletion(el, arr, pathToProperty){
      for(var i = 0; i < arr.length; i++){
        if(arr[i].ref == el.ref){
          that.splice(pathToProperty, i, 1);
        }
      }
    }
  }

  var instance;
  return {
    getInstance : function(component, userId){
      if(instance == null){
        instance = new RecipeDao(component, userId);
        instance.constructor = null;
      }
      return instance;
    }
  }

})();







