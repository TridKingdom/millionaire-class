(function($, _, Handlebars, Papa, Tabletop, tkDataStore) {
  'use strict';

  $(function() {

    /* =========================================================================
     * [Event Her Registrations]
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
        } else {
          $this.addClass('is-selected is-false');
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

        // Make score-list-item disabled
        $questionItem.addClass('disabled');
      });
    }

    /* =========================================================================
     * [Event Her Functions]
     * ====================================================================== */

    function _loadQuestionModule(moduleName) {
      return _buildModule(moduleName)
        .then(function() {
          _shouldStartLoading(false);
          window.location.href = window.location.origin + window.location.pathname + '#/slide-ready';
        })
        .fail(function() {
          _shouldStartLoading(false);
          window.location.href = window.location.origin + window.location.pathname + '#slide-index';
          console.warn('Fail loading question module <' + moduleName + '> , please try another one');
          _buildModule(moduleName, 'local');
        });
    }

    /* =========================================================================
     * [Privatections]
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

    activate();
  });
})(window.jQuery, window._, window.Handlebars, window.Papa, window.Tabletop, window.tkDataStore);
