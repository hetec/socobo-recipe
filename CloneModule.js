/**
 * Module to deeply clone objects and arrays
 * @type {{clone}}
 */
var CloneModule = CloneModule || (function(){

    /**
     * Method to recursively clone arrays.
     * The method calls _cloneObject(obj) to handle the cloning of deep objects.
     * @param arr
     * @returns {Array}
     * @private
     */
    function _cloneArray(arr){
      var tmp = [];
      arr.forEach(function(element){
        if(_isArray(element)){
          var a = _cloneArray(element);
          tmp.push(a);
        }else if(_isObjectAndNotArray(element)){
          var o = _cloneObject(element);
          tmp.push(o)
        }else{
          tmp.push(element);
        }
      });
      return tmp;
    }

    /**
     * Method to recursively clone objects.
     * The method calls _cloneArray(arr) to handle the cloning of deep arrays.
     * @param obj
     * @returns {{}}
     * @private
     */
    function _cloneObject(obj){
      var tmpObject = {};
      for(var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          if (_isObjectAndNotArray(obj[prop])) {
            var o = _cloneObject(obj[prop]);
            tmpObject[prop] = o;
          }else if(_isArray(obj[prop])){
            var a = _cloneArray(obj[prop]);
            tmpObject[prop] = a;
          }else{
            tmpObject[prop] = obj[prop];
          }
        }
      }
      return tmpObject;
    }

    /**
     * Manages calling the right method depending on the given parameter.
     * @param genes
     * @returns {array} if an array was given
     * @returns {object} if an object was given
     * @throws {Error} if the parameter is not an object (including arrays)
     * @private
     */
    function _clone(genes){
      if(_isObject(genes)){
        if(_isArray(genes)){
          return _cloneArray(genes);
        }else{
          return _cloneObject(genes);
        }
      }else{
        throw Error("Data type '" + typeof genes + "' is not supported. The type must be equal to 'object'");
      }
    }

    /**
     * Checks if a given parameter is an array
     * @param o
     * @returns {boolean}
     * @private
     */
    function _isArray(o) {
      return Object.prototype.toString.call(o) === '[object Array]';
    }

    /**
     * Checks if a given parameter is an object
     * @param o
     * @returns {boolean}
     * @private
     */
    function _isObject(o) {
      return o != null && typeof o === "object";
    }

    /**
     * Checks if a given parameter is an object but not an array
     * @param o
     * @returns {boolean}
     * @private
     */
    function _isObjectAndNotArray(o){
      return _isObject(o) && !_isArray(o);
    }

    /**
     * Public interface
     */
    return {
      clone : _clone
    };

  })();



