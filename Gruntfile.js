/*global module:false*/
module.exports = function(grunt) {
    var libFiles = ['lib/jquery-2.0.0.js', 'lib/easeljs-0.6.0.min.js'],
        appFiles = [],
        allFiles = ['dist/all-libs-tmp.js', 'dist/app-tmp.js'];

    // Project configuration.
    grunt.initConfig({

        less: {
            production: {
                files:{
                    'dist/css/style.css':'src/less/style.less'
                }
            }
        },

        lint: {
            files: appFiles
        },

        concat: {
            all_libs_tmp: {
                src: libFiles,
                dest: 'dist/all-libs-tmp.js'
            },
            app_tmp: {
                src: appFiles,
                dest: 'dist/app-tmp.js'
            },
            all: {
                src: allFiles,
                dest: 'dist/js/script.js'
            }

        },

        jshint: {
            options: {
                browser: true
            },
            globals: {
                jQuery: true
            }
        },

        clean: {
            prebuild: ['dist/'],
            postbuild: ['dist/all-libs-tmp.js', 'dist/app-tmp.js', 'tar_*']
        },

        copy: {
            js: {
                files: [{expand: true, cwd: 'src/js/', src: ['**'], dest: 'dist/js/'}]
            },
            images: {
                files: [{expand: true, cwd: 'src/img/', src: ['**/*.css', '**/*.{svg,png,gif,jpg,ico}'], dest: 'dist/brand/'}]
            }
        },

        compress: {
            zip: {
                options: {
                    mode: 'tgz',
                    archive: 'assets.tgz'
                },
                files: [{expand: true, cwd: 'dist', src: ['**'], dest: 'acid/'}]
            }
        },

        uglify: {}

    });

    // Load libs
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-less');

    // load the task in the tasks dir
    grunt.loadTasks('tasks');

    grunt.registerTask('default', ['clean:prebuild', 'less', 'concat:all_libs_tmp', 'clean:postbuild', 'copy:js', 'copy:brand', 'compress']);

};