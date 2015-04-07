/*global module:false*/
module.exports = function(grunt) {
    var libFiles = ['lib/jquery/jquery.js', 'lib/PreloadJS/lib/preloadjs-0.3.1.min.js', 'lib/EaselJS/lib/easeljs-0.6.0.min.js', 'lib/EaselJS/src/easeljs/utils/SpriteSheetUtils.js', 'lib/gl-matrix/dist/gl-matrix-min.js'],
        appFiles = ['src/js/physics/**.js','src/js/controls/**.js','src/js/app.js'],
        allFiles = ['dist/all-libs-tmp.js', 'dist/app-tmp.js'];

    // Project configuration.
    grunt.initConfig({
        bower: {
            install: {
               //just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory
            }
        },

        less: {
            production: {
                files:{
                    'dist/css/style.css':'src/less/style.less'
                }
            }
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
            all: appFiles,
            options: {
                browser: true,
                force: true,
                globals: {
                    jQuery: true
                }
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
            img: {
                files: [{expand: true, cwd: 'src/img/', src: ['**/*.css', '**/*.{svg,png,gif,jpg,ico}'], dest: 'dist/img/'}]
            },
            html: {
                files: [{expand: true, cwd: 'src/', src: ['*.html'], dest: 'dist/'}]
            }
        },

        compress: {
            zip: {
                options: {
                    mode: 'tgz',
                    archive: 'acid.tgz'
                },
                files: [{expand: true, cwd: 'dist', src: ['**'], dest: 'dist/'}]
            }
        }

    });

    // Load libs
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-bower-task');

    // load the task in the tasks dir
    grunt.loadTasks('tasks');

    grunt.registerTask('default', ['clean:prebuild', 'jshint', 'less', 'concat:all_libs_tmp', 'concat:app_tmp', 'concat:all', 'clean:postbuild', 'copy:js', 'copy:img', 'copy:html']);

};
