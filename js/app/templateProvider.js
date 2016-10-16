(function($, _, Handlebars) {
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
