const PDFDocument = require('pdfkit');
var DataUri = require('datauri-stream')
const qrcode = require('qr-image')
const fs = require('fs')

const generatePdf = (id)=> {
    const doc = new PDFDocument();
    const stream = doc.pipe(DataUri());
    const qr = qrcode.imageSync(id, { type: 'png' });
    doc.pipe(fs.createWriteStream('output.pdf'));
    return new Promise((resolve, _reject) => {
        doc.image(qr, 
            10,
            10,
            {fit: [100, 100]},
        )
        doc.end();
        let result = '';
        stream.on('data', function(chunk) {
            result += chunk;
        });
        return stream.on('finish', function () {
            return resolve(result)
        });
    })
}

process.argv.forEach((_val, _index, arguments) => {
    generatePdf(arguments[2]).then(pdf => console.log(pdf, 'QR code PDF has been generated'))
});
