const log4js = require('log4js');


log4js.configure({
    appenders: {
        dateFileAppender: {
            type: 'dateFile',
            filename: 'logs/app.log',
            pattern: '.yyyy-MM-dd',
            maxLogSize: 1024 * 1024 * 100, // 100MB
            backups: 5,
            compress: true
        },
        console: {
            type: 'console'
        }
    },
    categories: {
        default: {
            level: 'info',
            appenders: ['dateFileAppender', 'console'],
        }
    },
    layout: {
        pattern: '%d{yyyy-MM-dd hh:mm:ss} %[%-5p%] %f{1}.%M - %m%n',
        type: 'myLayout',
    },
});


module.exports = log4js;