const PDFDocument = require('pdfkit');
const qrcode = require('qr-image')
const fs = require('fs')

const generatePdf = (ids)=> {
    const doc = new PDFDocument();
    const dir = 'output.pdf'
    doc.pipe(fs.createWriteStream(dir));
    let x = 20;
    // 16 qr codes per page
    const itemsPerPage = 16;
    const rows = Math.sqrt(itemsPerPage);
    ids.map((id, index) => {
        const newPage = index % itemsPerPage === 0
        // new column
        if (index % rows === 0 && !newPage) {
            x += 100;
        // new page and not first page
        } else if (newPage & index > 4) {
            x = 20
            doc.addPage();
        }
        const qr = qrcode.imageSync(id, { type: 'png' });
        const position = {
            x,
            y: (index % rows) * 100 + 20
        }
        doc.image(qr, 
            position.x,
            position.y,
            {fit: [100, 100]},
        )
    })
    doc.end()
    console.log(dir)
}

const ids = process.argv.slice(2)
generatePdf(ids)
