
'use strict';

exports.description = 'Setups a basic HTML project.';
exports.notes = 'This will ask you some questions on how to setup your project.';
exports.after = 'Please run `npm install` to install the node modules and then' +
                ' `grunt` to start the local server (for live reload).';

exports.template = function(grunt, init, done) {
  var list = [
      init.prompt('name'),
      init.prompt('require_js_file','y'),
      init.prompt('require_css_file','y'),
      init.prompt('inject_jquery','y'),
      init.prompt('inject_bootstrap','n'),
      init.prompt('inject_mustache', 'n'),
      init.prompt('configure_ftp','y'),
      init.prompt('homepage', function(value, props, done) {

        // check if configure_ftp has Yes, then enable questions
        // for FTP
        if(/y/i.test(props.configure_ftp)) {
          list.splice(list.length - 2,0,init.prompt('ftphost','host'));
          list.splice(list.length - 2,0,init.prompt('ftpuser','user'));
          list.splice(list.length - 2,0,init.prompt('ftppass','pass'));
        }

        done();
      }),
      init.prompt('author_name')
  ];

  init.process({}, list, function(err, props) {

    // homepage value cant set a default
    if(props.homepage === 'undefined'){
      props.homepage = 'example.com';
    }

    var files = init.filesToCopy(props);

    props.configure_ftp = /y/i.test(props.configure_ftp);
    props.require_css_file = /y/i.test(props.require_css_file);
    props.require_js_file = /y/i.test(props.require_js_file);
    props.inject_jquery = /y/i.test(props.inject_jquery);
    props.inject_bootstrap = /y/i.test(props.inject_bootstrap);
    props.inject_mustache = /y/i.test(props.inject_mustache);

    // removing files which the user does not need.
    if(!props.require_css_file) {
      delete files['css/style.css'];
    }

    if(!props.require_js_file) {
      delete files['js/javascript.js'];
    }

    if(!props.configure_ftp) {
      delete files['.ftppass'];
    }

    if(!props.inject_jquery) {
      delete files['vendor/jquery-2.1.1/jquery-2.1.1.min.js'];
      delete files['vendor/jquery-2.1.1/jquery-2.1.1.min.map'];
    }

    if(!props.inject_bootstrap) {
      for(var file in files) {
        if(/bootstrap-3.1.1/i.test(file)) {
          delete files[file];
        }
      }
    }

    if(!props.inject_mustache) {
      delete files['vendor/mutache.js'];
    }

    var devDependencies = {
        "grunt": "~0.4.2",
        "grunt-contrib-jshint": "~0.7.2",
        "grunt-contrib-watch": "~0.5.3",
        "grunt-contrib-connect": "^0.8.0",
        "grunt-contrib-clean": "latest",
        "grunt-contrib-copy": "latest",
        "grunt-contrib-uglify": "latest",
        "grunt-processhtml": "~0.3.3"
      };

      if (props.configure_ftp) {
        devDependencies["grunt-ftpush"] = "^0.3.3";
      }

      // Generate package.json file, used by npm and grunt.
      init.writePackageJSON('package.json', {
        node_version: '>= 0.10.0',
        devDependencies: devDependencies
      });

    init.copyAndProcess(files,props);
    done();

  });

};