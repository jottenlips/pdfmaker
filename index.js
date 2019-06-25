const PDFDocument = require('pdfkit');
const DataUri = require('datauri-stream')
const qrcode = require('qr-image')
const fs = require('fs')

const generatePdf = (ids)=> {
    const doc = new PDFDocument();
    const stream = doc.pipe(DataUri());
    doc.pipe(fs.createWriteStream('output.pdf'));
    return new Promise((resolve, _reject) => {
        let x = 20;
        ids.map((id, index) => {
            const qr = qrcode.imageSync(id, { type: 'png' });
            if (index % 4 === 0 && index % 16 !== 0) {
                x += 100;
            } else if(index % 16 === 0 && index > 4) {
                x = 20
                doc.addPage();
            }
            const position = {
                x,
                y: (index % 4) * 100 + 20
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
