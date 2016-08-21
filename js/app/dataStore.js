(function(_) {
  'use strict';

  var tkDataStore = window.tkDataStore = window.tkDataStore || {};

  tkDataStore.csvSource = {
    local: {
      'basic': 'data/basic.csv',
      'taiwan': 'data/taiwan.csv',
      'world': 'data/world.csv',
    },
    drive: {
      'basic': 'https://docs.google.com/spreadsheets/d/193O-BB0Z4lESRCLHWkJX8nU2SmhavMnNX5gHJiSCVp8/export?format=csv',
      'taiwan': 'https://docs.google.com/document/d/1j3z7_E8xhprMX2yT3rHnkA37jWKtJTbfyDmk0oDej9M/export',
      'world': 'https://docs.google.com/spreadsheets/d/193O-BB0Z4lESRCLHWkJX8nU2SmhavMnNX5gHJiSCVp8/export?format=csv',
    }
  };

  tkDataStore.questionModules = {
    basic: {},
    taiwan: {},
    world: {},
  };

})(window._);