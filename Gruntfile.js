module.exports = function (grunt) {

  // Configuration du build
  grunt.initConfig({

    //////////////////////////////////////////////////
    //////////////////////////////////////////////////
    //// PARAMETERS FOR TASK
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////

    /*
    * SOURCE
    **/
    src: {
      html: 'src/main/html',
      res:  'src/main/assets',
      scss: {
        all: 'src/main/scss/**/*.scss',
        dir: 'src/main/scss/'
      },
      css: {
        all: 'src/main/css/**/*.css',
        dir: 'src/main/css/'
      },
      js:   ['src/main/javascript/**/*.js'],
      test: ['src/test/javascript/**/*.js']
    },
    
    /*
    * TARGET
    **/
    dest: {
      // Distant parameters
      root: 'dist',
      // Firefox Build
      firefox: {
        root:       'dist/firefox',
        html:       'dist/firefox/html',
        res:        'dist/firefox/assets',
        css:        'dist/firefox/css',
        js:         'dist/firefox/javascript'
      },
      // Chrome Build
      chrome: {
        root:       'dist/chrome',
        html: {
          index:    'dist/chrome/index.html',
          partials: 'dist/chrome/partials'
        },
        res:        'dist/chrome/assets',
        css:        'dist/chrome/css',
        js:         'dist/chrome/javascript'
      },
      // Standard Web Build
      web: {
        root:       'dist/web',
        html: {
          index:    'dist/web/index.html',
          partials: 'dist/web/partials'
        },
        res:        'dist/web/assets',
        css:        'dist/web/css',
        js:         'dist/web/javascript'
      }      
    },


    //////////////////////////////////////////////////
    //////////////////////////////////////////////////
    //// BUILD TASKS
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////

    /*
    * CLEAN DIRECTORIES
    **/
    clean: {
      all:      ['<%= dest.root %> '],
      firefox:  ['<%= dest.firefox.root %>'],
      chrome:   ['<%= dest.chrome.root %>'],
      web:      ['<%= dest.web.root %>']      
    },

    /*
    * COPY FILES
    **/
    copy: {
      // Firefox Copies
      firefox: {
        files: [
          { expand: true, cwd: '<%= src.html %>', src: ['**'], dest: '<%= dest.firefox.html %>' },
          { expand: true, cwd: '<%= src.res %>', src: ['**'], dest: '<%= dest.firefox.res %>' }
        ]
      },// Chrome Copies
      chrome: {
        files: [
          { expand: true, cwd: '<%= src.html %>', src: ['**'], dest: '<%= dest.chrome.root %>' },
          { expand: true, cwd: '<%= src.res %>', src: ['**'], dest: '<%= dest.chrome.res %>' }
        ]
      },
      // Standard Web Copies
      web: {
        files: [
          { expand: true, cwd: '<%= src.html %>', src: ['**'], dest: '<%= dest.chrome.root %>' },
          { expand: true, cwd: '<%= src.res %>', src: ['**'], dest: '<%= dest.chrome.res %>' }
        ]     
      }
    },

    /* Config auto des taches concat, uglify et cssmin */
    useminPrepare: {
      firefox: {
        html: '<%= dest.firefox.html.index %>',
        options: {
          dest: '<%= dest.firefox.root %>'
        }
      },
      chrome: {
        html: '<%= dest.chrome.html.index %>',
        options: {
          dest: '<%= dest.chrome.root %>'
        }
      },
      web: {
        html: '<%= dest.web.html.index %>',
        options: {
          dest: '<%= dest.web.root %>'
        }
      }
    },

    /* Usemin task */
    usemin: {
      firefox: {
        html: ['<%= dest.firefox.html.index %>'],
        options: {
          dirs: ['<%= dest.firefox.root %>']
        }

      },
      chrome: {
        html: ['<%= dest.chrome.html.index %>'],
        options: {
          dirs: ['<%= dest.chrome.root %>']
        }
      },
      web: {
        html: ['<%= dest.web.html.index %>'],
        options: {
          dirs: ['<%= dest.web.root %>']
        }
      }
    },


    //////////////////////////////////////////////////
    //////////////////////////////////////////////////
    //// DEVELOPMENT TASKS
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////

    /*
    * Compass Task
    */
    compass: {
      app: {
        options: {
          sassDir: '<%= src.scss.dir %>',
          cssDir: '<%= src.css.dir %>'
          //,environment: 'production'
        }
      }
    },

    /*
    * JShint check
    **/
    jshint: { 
      options: {
        jshintrc: '.jshintrc'
      },
      dev: {
        files: ['<%= src.js %>', '<%= src.test %>']
      },
      ic: {
        options: {
          reporter: 'checkstyle',
          reporterOutput: 'target/jshint_checkstyle.xml'
        },
        files: ['<%= src.js %>', '<%= src.test %>']
      }
    },


    /*
    * CSSLint check
    **/
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      dev: {
        src: '<%= src.css.all %>'
      },
      ic: {
        options: {
          formatters: [
            { id: 'checkstyle-xml', dest: 'target/csslint_checkstyle.xml' }
          ]
        },
        src: '<%= src.css.all %>'
      }
    },

    /*
    * Tests
    **/
    karma: {
      unit: {
        configFile : 'src/test/config/karma-unit.conf.js',
        reporters: ['progress', 'coverage'],
        browsers: ['Chrome']
      },     
      e2e: {
        configFile : 'src/test/config/karma-e2e.conf.js',
        reporters: ['progress'],
        browsers: ['Chrome']/*,
        singleRun: false*/
      },
      dev_unit: {
        configFile : 'src/test/config/karma-unit.conf.js',
        reporters: ['progress', 'coverage'],
        browsers: ['Chrome'], 
        singleRun: false
      },
      dev_e2e: {
        configFile : 'src/test/config/karma-e2e.conf.js',
        reporters: ['progress'],
        browsers: ['Chrome'] ,
        singleRun: false
      },
      ic_unit: {
        configFile: 'src/test/config/karma-unit.conf.js'
      },
      ic_e2e: {
        configFile: 'src/test/config/karma-e2e.conf.js'
      }
    },

    // Watch Configuration : compilation sass/compass + livereload 

    watch: {
      options: {
        livereload: true
      },
      sass: {
        files: ['<%= src.scss.all %>'],
        tasks: ['compass']
      },
      html: {
        files: ['src/main/html/**/*.html']
      },
      js: {
        files: ['src/main/javascript/**/*.js']
      }
    },

  });

  // Chargement des plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Déclaration des taches
  grunt.registerTask('lint',        ['jshint:dev', 'compass', 'csslint:dev']);
  grunt.registerTask('test',        ['lint', 'karma:unit', 'karma:e2e']);
  grunt.registerTask('ic',          ['jshint:ic', 'compass', 'csslint:ic', 'karma:ic_unit', 'karma:ic_e2e']);
  grunt.registerTask('dist_firefox',['compass', 'clean', 'copy:firefox:html', 'copy:firefox:res', 'useminPrepare:firefox', 'concat', 'uglify', 'cssmin', 'usemin:firefox']);
  grunt.registerTask('dist_chrome', ['compass', 'clean', 'copy:chrome:html', 'copy:chrome:res', 'useminPrepare:chrome', 'concat', 'uglify', 'cssmin', 'usemin:chrome']);
  grunt.registerTask('dist_web',    ['compass', 'clean', 'copy:web:html', 'copy:web:res', 'useminPrepare:web', 'concat', 'uglify', 'cssmin', 'usemin:web']);
  grunt.registerTask('release',     ['ic', 'dist_firefox', 'dist_chrome', 'dist_web']);
  grunt.registerTask('default',     ['test', 'dist_firefox', 'dist_chrome', 'dist_web']);

};