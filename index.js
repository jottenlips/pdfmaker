const PDFDocument = require('pdfkit');
var DataUri = require('datauri-stream')
const qrcode = require('qr-image')
const fs = require('fs')

const generatePdf = (ids)=> {
    const doc = new PDFDocument();
    const stream = doc.pipe(DataUri());
    doc.pipe(fs.createWriteStream('output.pdf'));
    return new Promise((resolve, _reject) => {
        ids.map((id, index) => {
            const qr = qrcode.imageSync(id, { type: 'png' });
            const position = {
                x: 20,
                y: index * 100 + 20
            }
            doc.image(qr, 
                position.x,
                position.y,
                {fit: [100, 100]},
            )
        })
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

const ids = process.argv.slice(2)
generatePdf(ids).then(pdf => console.log(pdf, 'QR code PDF has been generated'))
