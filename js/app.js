(function(_) {
  'use strict';

  var tkDataStore = window.tkDataStore = window.tkDataStore || {};

  // var googleDriveCsvUrl = 'https://docs.google.com/spreadsheets/d/1HnqeQtNhuqWvEJau5VINIn4DhivCSvLD5C3w4dLz5TA/pub?gid=0&single=true&output=csv';

  tkDataStore.moduelSource = {
    local: {
      basic: 'data/basic.csv',
      advanced: 'data/advanced.csv',
      aisa: 'data/aisa.csv',
      europe: 'data/europe.csv',
      africa: 'data/africa.csv',
      southAmerica: 'data/south-america.csv',
      northAmerica: 'data/north-america.csv',
    },
    cloud: {
      basic: '19gKrd4RpiU7evbYe-Bb8XJ18B7yzaD_ZqHlOFEMFu04',
      advanced: '1HnqeQtNhuqWvEJau5VINIn4DhivCSvLD5C3w4dLz5TA',
      aisa: 'xxx',
      europe: 'xxx',
      africa: 'xxx',
      southAmerica: 'xxx',
      northAmerica: 'xxx',
    }
  };

  tkDataStore.questionModules = {
    basic: {},
    advanced: {},
    aisa: {},
    europe: {},
    africa: {},
    southAmerica: {},
    northAmerica: {},
  };

  tkDataStore.decisionText = {
    yes: '你真了不起',
    no: '再接再厲吧',
  };

  tkDataStore.config = {
    title: '',
    source: 'cloud',
    player: '1',
    timer: 60,
  };

  tkDataStore.soundEffectSource = {
      applause: 'http://www.soundjay.com/human/applause-01.mp3',
      success: 'http://www.soundjay.com/misc/dream-harp-02.mp3',
      fail: 'http://www.soundjay.com/misc/fail-trombone-02.mp3',
      screaming: 'http://www.soundjay.com/human/man-screaming-01.mp3',
      laser: 'http://www.soundjay.com/button/button-3.mp3',
      handsaw: 'http://www.soundjay.com/mechanical/handsaw-1.mp3',
  };

  tkDataStore.soundEffect = {
    applause: new Audio(tkDataStore.soundEffectSource.applause),
    success: new Audio(tkDataStore.soundEffectSource.success),
    fail: new Audio(tkDataStore.soundEffectSource.fail),
    screaming: new Audio(tkDataStore.soundEffectSource.screaming),
    laser: new Audio(tkDataStore.soundEffectSource.laser),
    handsaw: new Audio(tkDataStore.soundEffectSource.handsaw),
  };

})(window._);
;(function($, _, Handlebars) {
  'use strict';

  $(function() {
    var tkDataStore = window.tkDataStore = window.tkDataStore || {};

    tkDataStore.templateSources = {
      moduleBasic: {id: 'moduleBasic', path: 'templates/module-basic.hbs', template: '', partial: false},
      moduleAdvanced: {id: 'moduleAdvanced', path: 'templates/module-advanced.hbs', template: '', partial: false},

      slideReady: {id: 'slideReady', path: 'templates/slide-ready.hbs', template: '', partial: true},
      slideScoreList: {id: 'slideScoreList', path: 'templates/slide-score-list.hbs', template: '', partial: true},

      slideQuestionBasic: {id: 'slideQuestionBasic', path: 'templates/slide-question-basic.hbs', template: '', partial: true},
      slideQuestionAdvanced: {id: 'slideQuestionAdvanced', path: 'templates/slide-question-advanced.hbs', template: '', partial: true},
      slideDetail: {id: 'slideDetail', path: 'templates/slide-detail.hbs', template: '', partial: true},
      slideDecision: {id: 'slideDecision', path: 'templates/slide-decision.hbs', template: '', partial: true},

      qcac: {id: 'qcac', path: 'templates/qcac.hbs', template: '', partial: true},
      qiac: {id: 'qiac', path: 'templates/qiac.hbs', template: '', partial: true},
      qvac: {id: 'qvac', path: 'templates/qvac.hbs', template: '', partial: true},
      qaac: {id: 'qaac', path: 'templates/qaac.hbs', template: '', partial: true},
      qcai: {id: 'qcai', path: 'templates/qcai.hbs', template: '', partial: true},
      qcan: {id: 'qcan', path: 'templates/qcan.hbs', template: '', partial: true},
      qian: {id: 'qian', path: 'templates/qian.hbs', template: '', partial: true},
      qvan: {id: 'qvan', path: 'templates/qvan.hbs', template: '', partial: true},
      qaan: {id: 'qaan', path: 'templates/qaan.hbs', template: '', partial: true}
    };

    function activate() {
      preFetchTemplates();
      registerIfCondHelper();
    }

    function preFetchTemplates() {
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
    }

    function registerIfCondHelper() {
      Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
        switch (operator) {
          case '==':
              return (v1 === v2) ? options.fn(this) : options.inverse(this);
          case '===':
              return (v1 === v2) ? options.fn(this) : options.inverse(this);
          case '<':
              return (v1 < v2) ? options.fn(this) : options.inverse(this);
          case '<=':
              return (v1 <= v2) ? options.fn(this) : options.inverse(this);
          case '>':
              return (v1 > v2) ? options.fn(this) : options.inverse(this);
          case '>=':
              return (v1 >= v2) ? options.fn(this) : options.inverse(this);
          case '&&':
              return (v1 && v2) ? options.fn(this) : options.inverse(this);
          case '||':
              return (v1 || v2) ? options.fn(this) : options.inverse(this);
          default:
              return options.inverse(this);
        }
      });
    }


    activate();

  });
})(window.jQuery, window._, window.Handlebars);
;(function($, _, Handlebars, Papa, Tabletop, tkDataStore) {
  'use strict';

  $(function() {

    /* =========================================================================
     * [Event Handler Registrations]
     * ====================================================================== */

    function activate() {
      _registerLoadQuestionModuleHandler();
      _registerChooseAnswerHandler();
      _registerMakeDecisionHandler();
    }

    function _registerLoadQuestionModuleHandler() {
      $('.js-load-question-module').on('click', function(event) {
        var $this = $(this);
        _loadQuestionModule($this.data('module'));
      });
    }

    function _registerChooseAnswerHandler() {
      $('#tk-millionarie-class').on('click', '.js-choose-answer', function(event) {
        var $this = $(this);
        var selectedAnswer = $this.data('option');
        var correctAnswer = $this.data('answer');

        if (selectedAnswer === correctAnswer) {
          $this.addClass('is-selected is-true');
          _soundEffect('success', 'play');
        } else {
          $this.addClass('is-selected is-false');
          _soundEffect('fail', 'play');
        }
      });
    }

    function _registerMakeDecisionHandler() {
      $('#tk-millionarie-class').on('click', '.js-decision-option', function(event) {
        var $this = $(this);
        var $title = $this.closest('.js-question-set').find('.js-decision-title');
        var $questionItem = $($this.data('question-item'));
        var decision = $this.data('decision');
        var optionText = $this.data('option') || tkDataStore.decisionText[decision];

        // Change Slide Title
        $title.text(optionText);

        // Hide Sibling Options
        $this.siblings('.js-decision-option').hide();

        // Make sound effect
        if (decision === 'yes') _soundEffect('applause', 'play');
        if (decision === 'no') _soundEffect('fail', 'play');

        // Make score-list-item disabled
        $questionItem.addClass('disabled');
      });
    }

    /* =========================================================================
     * [Event Handler Functions]
     * ====================================================================== */

    function _loadQuestionModule(moduleName) {
      _soundEffect('laser', 'loop');

      return _buildModule(moduleName)
        .then(function() {
          _shouldStartLoading(false);
          window.location.href = window.location.origin + window.location.pathname + '#/slide-ready';
          _soundEffect('laser', 'stop');
        })
        .fail(function() {
          _shouldStartLoading(false);
          window.location.href = window.location.origin + window.location.pathname + '#slide-index';
          console.warn('Fail loading question module <' + moduleName + '> , please try another one');
          _buildModule(moduleName, 'local');
          _soundEffect('laser', 'stop');
        });
    }

    /* =========================================================================
     * [Private functions]
     * ====================================================================== */

    function _buildModule(moduleName, source) {
      source = source || tkDataStore.config.source;
      _shouldStartLoading(true);

      if (source === 'cloud') {
        return _fetchCloudQuestionModule(moduleName)
            .then(_compileQuestionsSlides)
            .fail(function() {
              console.warn('Fail loading question module <' + moduleName + '> from Google Sheets, now try loading from local');
            });
      }
      else  {
        return _fetchLocalQuestionModule(moduleName)
          .then(_parseCsvQuestionModule)
          .then(_compileQuestionsSlides);
      }
    }

    function _fetchLocalQuestionModule(moduleName) {
      return $.ajax({
        url: tkDataStore.moduelSource.local[moduleName],
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

    function _parseCsvQuestionModule(module) {
      tkDataStore.questionModules[module.name] = Papa.parse(module.csv, {header: true, dynamicTyping: true}).data;

      return {
        name: module.name,
        questions: tkDataStore.questionModules[module.name]
      };
    }

    function _fetchCloudQuestionModule(moduleName) {
      var deferred = $.Deferred();
      var timer;

      timer = setTimeout(function () {
        deferred.reject('loading timeout');
      }, 5000);

      Tabletop.init({
        key: tkDataStore.moduelSource.cloud[moduleName],
        callback: function(data, tabletop) {
          tkDataStore.questionModules[moduleName] = data;
          clearTimeout(timer);
          deferred.resolve({
            name: moduleName,
            questions: tkDataStore.questionModules[moduleName]
          });
        },
        simpleSheet: true,
        parseNumbers: true
      });


      return deferred.promise();
    }

    function _compileQuestionsSlides(module) {
      var moduleTemplateName = 'module' + _.capitalize(module.name);
      var moduleClassName = 'module-' + module.name;
      var slides = _compileTemplate(moduleTemplateName, {questions: module.questions});

      // Clean up existing modules
      $('.reveal .slides .js-question-set').remove();

      // Populate loaded module slides
      $('#slide-index').after(slides);

      // Register new module class name to <body>
      $('.tk-millionarie-class')
        .removeClass()
        .addClass('tk-millionarie-class ' + moduleClassName);
    }

    function _compileTemplate(templateName, model) {
      return Handlebars.compile(tkDataStore.templateSources[templateName].template)(model);
    }

    function _shouldStartLoading(isLoading) {
      var $elementsToBeHidden = $('.js-hide-when-loading');
      var $elementsToBeShown = $('.js-show-when-loading');

      if (isLoading) {
        $elementsToBeHidden.addClass('is-hidden');
        $elementsToBeShown.removeClass('is-hidden');
      } else {
        $elementsToBeHidden.removeClass('is-hidden');
        $elementsToBeShown.addClass('is-hidden');
      }
    }

    function _soundEffect(type, mode) {
      var soundEffect = tkDataStore.soundEffect[type];

      // Stop all other soundeffect
      Object.keys(tkDataStore.soundEffect).forEach(function(key) {
        tkDataStore.soundEffect[key].currentTime = 0;
        tkDataStore.soundEffect[key].pause();
      });

      switch (mode) {
        case 'play':
          soundEffect.play();
          return;

        case 'loop':
          soundEffect.loop = true;
          soundEffect.play();
          return;

        case 'stop':
          soundEffect.loop = false;
          soundEffect.currentTime = 0;
          soundEffect.pause();
          return;

        default:
          soundEffect.play();
          return;
      }
    }

    activate();
  });
})(window.jQuery, window._, window.Handlebars, window.Papa, window.Tabletop, window.tkDataStore);
