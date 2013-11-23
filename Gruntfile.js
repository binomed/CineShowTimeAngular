module.exports = function (grunt) {

  // Configuration du build
  grunt.initConfig({

    // Parametrage

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
    
    dest: {
      root:       'src/main/webapp',
      html: {
        index:    'src/main/webapp/index.html',
        partials: 'src/main/webapp/partials'
      },
      res:        'src/main/webapp/assets',
      css:        'src/main/webapp/css',
      js:         'src/main/webapp/javascript'
    },

    // Configuration des taches

    clean: {
      html:  ['<%= dest.html.index %>', '<%= dest.html.partials %>'],
      res:   ['<%= dest.res %>'],
      css:   ['<%= dest.css %>'],
      js:    ['<%= dest.js %>']
    },

    copy: {
      html: {
        files: [
          { expand: true, cwd: '<%= src.html %>', src: ['**'], dest: '<%= dest.root %>' }
        ]
      },
      res: {
        files: [
          { expand: true, cwd: '<%= src.res %>', src: ['**'], dest: '<%= dest.res %>' }
        ]
      }
    },

    compass: {
      app: {
        options: {
          sassDir: '<%= src.scss.dir %>',
          cssDir: '<%= src.css.dir %>'
          //,environment: 'production'
        }
      }
    },

    /* Config auto des taches concat, uglify et cssmin */
    useminPrepare: {
      html: '<%= dest.html.index %>',
      options: {
        dest: '<%= dest.root %>'
      }
    },

    usemin: {
      html: ['<%= dest.html.index %>'],
      options: {
        dirs: ['<%= dest.root %>']
      }
    },

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

    // Configuration du watch : compilation sass/compass + livereload sur css et html

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
  grunt.registerTask('lint',    ['jshint:dev', 'compass', 'csslint:dev']);
  grunt.registerTask('test',    ['lint', 'karma:unit', 'karma:e2e']);
  grunt.registerTask('ic',      ['jshint:ic', 'compass', 'csslint:ic', 'karma:ic_unit', 'karma:ic_e2e']);
  grunt.registerTask('dist',    ['compass', 'clean', 'copy:html', 'copy:res', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'usemin']);
  grunt.registerTask('deploy',  ['sshexec:clean', 'sftp:recette']);
  grunt.registerTask('release', ['ic', 'dist']);
  grunt.registerTask('default', ['test', 'dist']);

};