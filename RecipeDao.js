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
    var _recipesUrl = _getGlobalRecipesUrl();
    var _userUrl = _getUserRecipesUrl();

    /**
     *
     * @returns {string}
     * @private
     */
    function _getGlobalRecipesUrl() {
      return _baseUrl + "recipes/"
    }

    /**
     *
     * @returns {string}
     * @private
     */
    function _getUserRecipesUrl() {
      return _baseUrl + "users/" + _id + "/recipes";
    }

    /**
     *
     * @param obj
     * @param propName
     * @returns {boolean}
     * @private
     */
    function _checkProperty(obj, propName) {
      return obj.hasOwnProperty(propName);
    }

    /**
     *
     * @param source
     * @param dest
     * @param arrProp
     * @private
     */
    function _fillArrayProperty(source, dest, arrProp) {
      if(_checkProperty(dest, arrProp)){
        for (var j in source[arrProp]) {
          if(_checkProperty(source[arrProp], j)){
            (dest[arrProp]).push(source[arrProp][j]);
          }
        }
      }
    }

    /**
     * changed
     * @param obj
     * @returns {Promise}
     */
    function add(obj) {
      return new Promise(function(resolve, reject) {
        // set author to recipe object
        obj.userId = _id;
        // #1 save recipe under /recipes
        var dataGlobalRef = new Firebase(_recipesUrl);
        var recipeRef = dataGlobalRef.push(obj, function (error) {
          if (error) {
            reject({value: "Sorry a technical error occured while creating your recipe :("});
          } else {
            // #2 Get Ref Id from current saved recipe
            var recipeId = recipeRef.key();
            // #3 Save recipe ref id to /users/recipes
            var dataRef = new Firebase(_userUrl);
            dataRef.push({id : recipeId}, function (error) {
              if (error) {
                reject({value: "Sorry a technical error occured while saving your recipe :("});
              } else {
                resolve({value: "Element successfully saved!"});
              }
            });
          }
        });
      });
    }

    /**
     * changed
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
     * changed
     * @param obj
     * @returns {Promise}
     */
    function remove(obj)  {
      return new Promise(function(resolve, reject) {
        var dataRef = new Firebase(obj.ref.toString());
        var userRef = new Firebase(obj.refUser);
        var counter = 0;
        var onComplete = function (error) {
          if (error) {
            reject({value: "Sorry a technical error occured while deleting your recipe :("});
          } else {
            if (counter !== 1) {
              counter++;
            } else {
              resolve({value: "Element successfully removed!", item: obj});
            }
          }
        };
        dataRef.remove(onComplete);
        userRef.remove(onComplete);
      });
    }

    /**
     * changed
     * @returns {Promise}
     */
    function getAll() {
      return new Promise(function(resolve, reject) {
        _getRecipesIds()
          .then(function(ids) {
            _getRecipes(ids.keys, ids.value)
              .then(function(recipes) {
                resolve({value: recipes});
              });
          })
          .catch(function(error) {
            reject({value: "Sorry a technical error occured while fetching your recipes. " + error.value});
          });
      });
    }

    /**
     * Get Recipe Ids from /user/recipes
     * @returns {Promise}
     * @private
     */
    function _getRecipesIds() {
      return new Promise(function(resolve, reject) {
        var idKeys = [];
        var ids = [];
        var dataRef = new Firebase(_userUrl);
        dataRef.once("value", function(snapshot) {
          snapshot.forEach(function(item) {
            idKeys.push(item.key());
            ids.push(item.val().id);
          });
          resolve({keys: idKeys, value: ids});
        }, function(err){
          reject({value: err.message});
        });
      });
    }

    /**
     * Get all Recipes from /recipes with ids
     * @param keys
     * @param ids
     * @returns {Promise}
     * @private
     */
    function _getRecipes(keys, ids) {
      return new Promise(function(resolve, reject) {
        // Promise Holder
        var recipePromise = [];
        // iterate over all recipe ids and get the recipe
        ids.forEach(function(id, index) {
          recipePromise.push(_getRecipe(keys[index], id));
        });
        // bundle all promise values to one promise
        Promise.all(recipePromise)
          .then(function(recipes) {
            resolve(recipes);
          })
          .catch(function(error) {
            reject(error.message);
          });
      });
    }

    /**
     * Get specific Recipe from /recipes with id
     * @param key
     * @param id
     * @returns {Promise}
     * @private
     */
    function _getRecipe(key, id) {
      return new Promise(function(resolve, reject) {
        var ref = new Firebase(_recipesUrl + "/" + id);
        ref.once("value", function(snapshot) {
          // recipe item from firebase
          var item = snapshot.val();
          // init recipe object
          var recipe = {};
          // fill recipe object with data
          recipe.ref = snapshot.ref();
          recipe.refUser = _userUrl + "/" + key;
          recipe.desc = item.desc;
          recipe.info = item.info;
          recipe.image = item.image;
          recipe.ingredients = [];
          recipe.steps = [];
          recipe.text = item.text;
          _fillArrayProperty(item, recipe, "ingredients");
          _fillArrayProperty(item, recipe, "steps");
          // return recipe object
          resolve(recipe);
        }, function(err) {
          reject(err.message);
        });
      });
    }

    /**
     * Public Functions
     */
    return {
      add    : add,
      update : update,
      remove : remove,
      getAll : getAll
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
