var app = require('express')();
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
var fs = require('fs');
var readline = require('readline');
var stream = require('stream');

var fileName = './hour-control.csv';

app.use(bodyParser.text()); // for parsing text

app.post('/presence', (request, response) => {
    console.log(request.body);

    var fd;
    try {
        var data = '';
        const exists = fs.existsSync(fileName);

        if (!exists) {
            data = 'sep=;';
        } else {
            data = fs.readFileSync(fileName, 'utf8');
        }
        console.log('data = ' + data);

        const csv = request.body;
        const parsedCsv = csv.split(';');
        var newRecord = true;
        console.log(parsedCsv);

        // data.split('\n').forEach(line => {
        //     if (line.startsWith(parsedCsv[0])) {
        //         const parsedLine = line.split(';');
        //         const newLine =
        //             line.replace(parsedLine[1], parsedCsv[1])
        //                 .replace(parsedLine[2], parsedCsv[2]);
        //         data = data.replace(line, newLine);
        //         newRecord = false;
        //     }
        // });

        const inputstream = fs.createReadStream(fileName, {flags: 'a+'});
        const rl = readline.createInterface(inputstream);

        rl.on('line', function(line) {
            console.log(`Line from file: ${line}`);
            if (line.startsWith(parsedCsv[0])) {
                const parsedLine = line.split(';');
                const newLine =
                    line.replace(parsedLine[1], parsedCsv[1])
                        .replace(parsedLine[2], parsedCsv[2]);
                data = data.replace(line, newLine);
                newRecord = false;
            }
        });

        rl.on('close', function() {
            console.log('Finished reading');
            if (newRecord) {
                data = data + '\n' + csv;
            }
            fd = fs.openSync(fileName, 'w');
            fs.writeSync(fd, data, 'utf8');
            response.end('Done!');
        });
    } catch (err) {
        const error = 'File handling error ' + err.code + ': ' + err.message;
        console.error(error);
        response.status(500).send(error);
    } finally {
        if (fd !== undefined) {
            fs.closeSync(fd);
        }
    }
});

app.get('/presence', (request, response) => {
    let fd;
    try {
        let exists = fs.existsSync('hour-control.csv');
        fd = fs.openSync('hour-control.csv', 'r');
    } catch (err) {
        const error = 'File handling error ' + err.code + ': ' + err.message;
        console.error(error);
        response.status(500).send(error);
    }
});

var server = app.listen(3000, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
});
