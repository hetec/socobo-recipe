var DataUtils = (function(){
  /**
   * Main content of this object belongs here
   * @constructor
   */
  function DataUtils(){

    function sortStepsByNumber(step1, step2){
      return step1.number - step2.number;
    }

  }

  /**
   * Handle the single instance of this utility object
   */
  var instance;
  return {
    getInstance : function(){
      if(instance == null){
        instance = new DataUtils();
        instance.constructor = null;
      }
      return instance;
    }
  }

})();
