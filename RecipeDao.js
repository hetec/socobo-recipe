var RecipeDao = (function(){
  /**
   * Instance stores a reference to the Singleton
   */
  var instance;

  function init(user) {
    /**
     *
     */
    var _baseUrl = user.firebaseUrl;
    var _id = user.userId;
    var _userUrl = _getUserUrl();

    /**
     *
     * @returns {string}
     * @private
     */
    function _getUserUrl() {
      return _baseUrl + "recipes/" + _id;
    }

    /**
     *
     * @param obj
     * @param propName
     * @returns {boolean}
     * @private
     */
    function _checkProperty(obj, propName){
      return obj.hasOwnProperty(propName);
    }

    /**
     *
     * @param source
     * @param dest
     * @param arrProp
     * @private
     */
    function _fillArrayProperty(source, dest, arrProp){
      if(_checkProperty(dest, arrProp)){
        for (var j in source[arrProp]) {
          if(_checkProperty(source[arrProp], j)){
            (dest[arrProp]).push(source[arrProp][j]);
          }
        }
      }
    }

    /**
     *
     * @param obj
     * @returns {Promise}
     */
    function add(obj) {
      return new Promise(function(resolve, reject) {
        var dataRef = new Firebase(_userUrl);
        dataRef.push(obj, function (error) {
          if (error) {
            reject({value: "Sorry a technical error occured while saving your recipe :("});
          } else {
            resolve({value: "Element successfully created!"});
          }
        });
      });
    }

    /**
     *
     * @param obj
     * @returns {Promise}
     */
    function update(obj) {
      //
      var reference = obj.ref.toString();
      //
      var newObj = {};
      for (var e in obj) {
        if (e != "ref" && e != "info") {
          if(_checkProperty(obj, e)){
            newObj[e] = obj[e];
          }
        }
      }
      //
      return new Promise(function(resolve, reject) {
        var dataRef = new Firebase(reference);
        dataRef.set(newObj, function (error) {
          if (error) {
            reject({value: "Sorry a technical error occured while updating your recipe :("});
          } else {
            resolve({value: "Element successfully updated!"});
          }
        });
      });
    }

    /**
     *
     * @param obj
     * @returns {Promise}
     */
    function remove(obj) {
      return new Promise(function(resolve, reject) {
        var dataRef = new Firebase(obj.ref.toString());
        dataRef.remove(function (error) {
          if (error) {
            reject({value: "Sorry a technical error occured while deleting your recipe :("});
          } else {
            resolve({value: "Element successfully removed!"});
          }
        });
      });
    }

    /**
     *
     * @returns {Promise}
     */
    function getAll(){
      return new Promise(function(resolve, reject) {
        var recipes = [];
        var dataRef = new Firebase(_userUrl);
        dataRef.once("value", function (snapshot) {
          var val = snapshot.val();
          for(var e in val){
            var recipe = {};
            var source;
            if (_checkProperty(val, e)) {
              source =  val[e];
              recipe.ref = snapshot.ref() + "/" + e;
              recipe.desc = source.desc;
              recipe.info = source.info;
              recipe.ingredients = [];
              recipe.steps = [];
              recipe.text = source.text;
              _fillArrayProperty(source, recipe, "ingredients");
              _fillArrayProperty(source, recipe, "steps");
            } else {
              recipe.ref = snapshot.ref() + "/" + e;
              recipe.desc = "no titel";
              recipe.info = "-";
              recipe.ingredients = [];
              recipe.steps = [];
              recipe.text = "no description";
            }
            recipes.push(recipe);
          }
          resolve({value: recipes});
        }, function(err){
          reject({value: "Sorry a technical error occured while fetching your recipes :("});
        });
      });
    }

    /**
     *
     * @param recipe
     * @returns {Promise}
     */
    function findImage(recipe){
      return new Promise(function(resolve, reject) {
        var dbUrl = recipe.ref.toString() + "/image";
        var dataRef = new Firebase(dbUrl);
        dataRef.once("value", function (snapshot) {
          resolve({value: snapshot.val()});
        }, function(error){
          reject({value: "Getting image from the database failed"});
        });
      });
    }

    /**
     *
     */
    return {
      add    : add,
      update : update,
      remove : remove,
      getAll : getAll,
      findImage : findImage
    };
  }

  return {
    /**
     * Get the Singleton instance if one exist or create one if it doesn't
     * @param user
     * @returns {Object}
     */
    getInstance: function(user) {
      if (!instance) {
        instance = init(user);
      }
      return instance;
    }
  };
})();
