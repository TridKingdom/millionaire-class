(function($, _, Handlebars, Papa, Tabletop, tkDataStore) {
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

      Papa.parse(tkDataStore.moduelSource.cloud[moduleName], {
        download: true,
        header: true,
        complete: function (results) {
          tkDataStore.questionModules[moduleName] = results.data;
          clearTimeout(timer);
          deferred.resolve({
            name: moduleName,
            questions: tkDataStore.questionModules[moduleName]
          });
        }
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
