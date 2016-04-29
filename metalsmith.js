var Metalsmith = require('metalsmith');
var collections = require('metalsmith-collections');
var markdown = require('metalsmith-markdown');
var permalinks = require('metalsmith-permalinks');
var dateFormatter = require('metalsmith-date-formatter');
var layouts = require('metalsmith-layouts');
var serve = require('metalsmith-serve');
var watch = require('metalsmith-watch');

Metalsmith(__dirname)
    .use(collections({
        "schuze": {
            "pattern": "zapisy/schuze/**/*.*",
            "sortBy": "date"
        },
        "spravni": {
            "pattern": "zapisy/spravni_rada/**/*.*",
            "sortBy": "date"
        }
    }))
    .use(markdown())
    .use(permalinks(
        {
            "pattern": ":path:date",
            "relative": false
        }
    ))
    .use(dateFormatter({
        "dates": [{
            "key": "date",
            "format": "D. M. YYYY"
        }]
    }))
    .use(layouts({
        "engine": "handlebars",
        "directory": "src/layouts"
    }))
    .use(serve({
        "host": "0.0.0.0",
        "port": process.env.PORT || 5000
    }))
    .use(watch())
    .build(function (err) {
        if (err) throw err;
    });


