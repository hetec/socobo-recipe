function RecipeDao(component, userId) {
    var that = component;
    var id = userId;
    var userUrl = getUserUrl();

    function getUserUrl() {
      return that.url + "recipes/" + id;
    }

    this.add = function (obj) {
      var dataRef = new Firebase(userUrl);
      dataRef.push(obj, function (error) {
        if (error) {
          alert("Error while saving your data " + error);
          console.error("ERROR in ADD RECIPE");
          console.error(error);
        } else {
          console.log("Element created at: " + userUrl);
        }
      });
    };

    this.update = function (obj) {
      var reference = "" + obj.ref + "";
      var newObj = {};
      for (var e in obj) {
        if (e != "ref" && e != "info") {
          if(checkProperty(obj, e)){
            newObj[e] = obj[e];
          }
        }
      }
      var dataRef = new Firebase(reference);
      dataRef.set(newObj, function (error) {
        if (error) {
          alert("Error while saving your data " + error);
          console.error("ERROR in EDIT RECIPE");
          console.error(error);
        } else {
          console.log("Element updated to: ");
          console.log(newObj);
        }
      });
      that.recipes = [];
    };

    this.getAll = function(){
      var dataRef = new Firebase(userUrl);
      dataRef.once("value", function (snapshot) {
        var val = snapshot.val();
        for(e in val){
          var recipe = {};
          var source;
          if(checkProperty(val, e)){
            source =  val[e];
            recipe.ref = snapshot.ref() + "/" + e;
            recipe.desc = source.desc;
            recipe.info = source.info;
            recipe.ingredients = [];
            recipe.steps = [];
            recipe.text = source.text;
            fillArrayProperty(source, recipe, "ingredients");
            fillArrayProperty(source, recipe, "steps");
          }else {
            recipe.ref = snapshot.ref() + "/" + e;
            recipe.desc = "no titel";
            recipe.info = "-";
            recipe.ingredients = [];
            recipe.steps = [];
            recipe.text = "no description";
          }
          that.push("recipes", recipe);
        }
        console.log("Fetching all recipes from db completed!");
      }, function(err){
        alert("ERROR while fetching all recipes!");
        console.error("ERROR in GET ALL RECIPES");
        console.error(err);
      });
    };

    this.getAndUpdate = function () {
      console.log("Initialize alle recipes and keep updating on change");
      var dataRef = new Firebase(userUrl);
      dataRef.on("child_added", function (snapshot) {
        new Promise(function (resolve, reject) {
          resolve(snapshot.val());
        }).then(function (val) {
          var recipe = {};
          recipe.ref = snapshot.ref();
          recipe.desc = val.desc;
          recipe.info = val.info;
          recipe.ingredients = [];
          recipe.steps = [];
          recipe.text = val.text;
          fillArrayProperty(val, recipe, "ingredients");
          fillArrayProperty(val, recipe, "steps");
          that.push('recipes', recipe);
        }).catch(function (err) {
          console.log(err);
        });
      }, function (err) {
        console.log(err);
      });
    };

    this.remove = function (obj, succ, err) {
      if (typeof succ === 'undefined') {
        succ = function () {
          console.log('Deletion succeeded');
        }
      }
      if (typeof err === 'undefined') {
        err = function () {
          console.log('Deletion failed');
        }
      }
      if (typeof succ !== 'function') {
        throw "The callback for success in removeRecipe() is not a function";
      }
      if (typeof err !== 'function') {
        throw "The callback for errors in removeRecipe() is not a function";
      }
      var dataRef = new Firebase("" + obj.ref);
      dataRef.remove(function (error) {
        if (error) {
          err();
        } else {
          succ();
        }
      });
    };

    function checkProperty(obj, propName){
      return obj.hasOwnProperty(propName);
    }

    function fillArrayProperty(source, dest, arrProp){
      if(checkProperty(dest, arrProp)){
        for (var j in source[arrProp]) {
          if(checkProperty(source[arrProp], j)){
            (dest[arrProp]).push(source[arrProp][j]);
          }
        }
      }
    }
}







