module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: ['public/lib/**/*.js','public/client/**/*.js'],
        dest: 'public/dist/bundle.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      my_target: {
        files: {
          'public/dist/bundle.min.js': ['public/dist/bundle.js']
        }
      }
    },

    eslint: {
      target: [ 
        'public/client/**/*.js','public/lib/**/*.js'
      ]
    },

    cssmin: {
      target: {
        files: {
          'public/dist/style.min.css': ['public/style.css']
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      options: { stdout: true },
      pushToProd: {
        command: 'git push live master'
      },
      pushToDev: {
        command: 'git push origin master'
      },
      openToProd: {
        command: 'open http://104.236.169.203:4568'
      },
      openToDev: {
        command: 'open http://127.0.0.1:4568'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
      cmd: 'grunt',
      grunt: true,
      args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', ['eslint', 'concat', 'uglify','cssmin']);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      grunt.task.run('shell:pushToProd');
    } else {
      grunt.task.run('shell:pushToDev');
    }
  });

  grunt.registerTask('deploy', function(){
    if (grunt.option('prod')) {
      grunt.task.run(['build','test','upload', 'shell:openToProd']);
    } else {
      grunt.task.run(['build','test', 'server-dev', 'shell:openToDev', 'nodemon']);
    }
  });


};
