import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

interface DocumentData {
  id: string;
  title: string;
  content?: string;
  pages?: Array<{
    id: string;
    content: string;
    pageNumber: number;
  }>;
  paragraphs?: Array<{
    id: string;
    content: string;
    position: number;
  }>;
}

export async function generateSamplePDF(docData: DocumentData): Promise<Blob> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  // Add a page
  const page = pdfDoc.addPage([612, 792]); // Standard US Letter size
  const { width, height } = page.getSize();

  // Title
  const title = docData.title || 'Service Agreement';
  page.drawText(title, {
    x: 50,
    y: height - 50,
    size: 18,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  // Sample Service Agreement Content
  const content = `
SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into on _____________ 
between ________________________________ ("Client") and 
________________________________ ("Service Provider").

SERVICES TO BE PROVIDED:
The Service Provider agrees to provide the following services:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

PAYMENT TERMS:
Total Contract Value: $______________
Payment Schedule: _______________________________________________
Payment Method: ________________________________________________

SIGNATURES:

Client Name: ____________________________  Date: ______________
Client Signature: _________________________________________________


Service Provider Name: ____________________  Date: ______________  
Service Provider Signature: _______________________________________


Witness Name: ___________________________  Date: ______________
Witness Signature: _______________________________________________
`.trim();

  const lines = content.split('\n');
  let yPosition = height - 100;
  
  lines.forEach((line) => {
    if (yPosition < 50) {
      // Add new page if we run out of space
      const newPage = pdfDoc.addPage([612, 792]);
      yPosition = newPage.getSize().height - 50;
      
      newPage.drawText(line, {
        x: 50,
        y: yPosition,
        size: 12,
        font: line.includes(':') && line.endsWith(':') ? boldFont : font,
        color: rgb(0, 0, 0),
      });
    } else {
      page.drawText(line, {
        x: 50,
        y: yPosition,
        size: 12,
        font: line.includes(':') && line.endsWith(':') ? boldFont : font,
        color: rgb(0, 0, 0),
      });
    }
    
    yPosition -= 20;
  });

  // Serialize the PDF
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}