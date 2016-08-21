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

})(window._);;(function($, _, Handlebars) {
  'use strict';

  $(function() {
    var tkDataStore = window.tkDataStore = window.tkDataStore || {};

    tkDataStore.templateSources = {
      slideReady: {id: 'slideReady', path: 'templates/slide-ready.hbs', template: '', partial: true},
      qcac: {id: 'qcac', path: 'templates/qcac.hbs', template: '', partial: false},
      qiac: {id: 'qiac', path: 'templates/qiac.hbs', template: '', partial: false},
      qvac: {id: 'qvac', path: 'templates/qvac.hbs', template: '', partial: false},
      qaac: {id: 'qaac', path: 'templates/qaac.hbs', template: '', partial: false},
      qcai: {id: 'qcai', path: 'templates/qcai.hbs', template: '', partial: false},
      qcan: {id: 'qcan', path: 'templates/qcan.hbs', template: '', partial: false},
      qian: {id: 'qian', path: 'templates/qian.hbs', template: '', partial: false},
      qvan: {id: 'qvan', path: 'templates/qvan.hbs', template: '', partial: false},
      qaan: {id: 'qaan', path: 'templates/qaan.hbs', template: '', partial: false}
    };

    /**
     * [Prefatch template string and register partials]
     */
    _.forEach(tkDataStore.templateSources, function(source) {
      $.get(source.path)
        .then(function(template) {
          // source.template = Handlebars.compile(template);
          source.template = template;
          return source;
        })
        .then(function(source) {
          if (source.partial) Handlebars.registerPartial(source.id, source.template);
        })
        .fail(function(err) {
          console.warn('Fail loading template <' + source.id + '> , please check whether the template file exist');
        });
    });

  });

})(window.jQuery, window._, window.Handlebars);;(function($, _, Handlebars, Papa, tkDataStore) {

  'use strict';

  $(function() {

    /* =========================================================================
     * [Event Her Registrations]
     * ====================================================================== */

    function activate() {
      _registerLoadQuestionModuleHandler();
    }

    function _registerLoadQuestionModuleHandler() {
      $('.js-load-question-module').on('click', function(event) {
        var $this = $(this);
        _loadQuestionModule($this.data('module'));
      });
    }

    /* =========================================================================
     * [Event Her Functions]
     * ====================================================================== */

    function _loadQuestionModule(moduleName) {
      return _buildModule(moduleName)
        .then(function() {
          window.location.href = window.location.origin + window.location.pathname + '#/slide-ready';
        })
        .fail(function() {
          window.location.href = window.location.origin + window.location.pathname;
          console.warn('Fail loading question module <' + moduleName + '> , please try another one');
        });
    }

    /* =========================================================================
     * [Privatections]
     * ====================================================================== */

    function _buildModule(moduleName) {
      return _fetchQuestionModule(moduleName)
        .then(_parseQuestionModule)
        .then(_compileQuestionsSlides);
    }

    function _fetchQuestionModule(moduleName) {
      return $.ajax({
        url: tkDataStore.csvSource.local[moduleName],
        type: 'GET',
      })
      .then(function(csvString) {
        return {
          name: moduleName,
          csv: csvString,
        };
      })
      .fail(function() {
        console.warn('Fail loading question module <' + moduleName + '> , please try another one');
      });
    }

    function _parseQuestionModule(module) {
      tkDataStore.questionModules[module.name] = Papa.parse(module.csv, {header: true}).data;
      return tkDataStore.questionModules[module.name];
    }

    function _compileQuestionsSlides(questions) {
      var slides = _compileTemplate('qaac', {questions: questions});
      $('.reveal .slides .js-question-set').remove();
      $('#slide-index').after(slides);
    }

    function _compileTemplate(templateName, model) {
      return Handlebars.compile(tkDataStore.templateSources[templateName].template)(model);
    }


    /* =========================================================================
     *
     * [utilock]
     * The follg lines will be executed sequentially
     *
     * ====================================================================== */

    activate();

  });
})(window.jQuery, window._, window.Handlebars, window.Papa, window.tkDataStore);
