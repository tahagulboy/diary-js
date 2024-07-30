document.addEventListener('DOMContentLoaded', () => {
    const { Document, Packer, Paragraph, TextRun } = docx;
    const notlarTextarea = document.getElementById('notlar');
    const kaydetButonu = document.getElementById('kaydet');
    const yukleButonu = document.getElementById('yukle');
    const dosyaSecici = document.getElementById('dosya-secici');

    kaydetButonu.addEventListener('click', async () => {
        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun(notlarTextarea.value),
                            ],
                        }),
                    ],
                },
            ],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, 'notlar.docx');
    });

    yukleButonu.addEventListener('click', () => {
        dosyaSecici.click();
    });

    dosyaSecici.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const arrayBuffer = e.target.result;
                const doc = await docx.Packer.toDocument(arrayBuffer);
                const paragraphs = doc.sections[0].children;
                const text = paragraphs.map(p => p.children.map(run => run.text).join('')).join('\n');
                notlarTextarea.value = text;
            };
            reader.readAsArrayBuffer(file);
        }
    });
});