//Do something outside React UI like logics
import jsPDF from 'jspdf';//convert image → PDF
import html2canvas from 'html2canvas'; //can only capture real DOM elements screenshot UI

export async function exportElementAsPdf(element: HTMLElement, title: string): Promise<void> { //THAT DIV, title for the PDF file name
  try {
    // Create a wrapper with metadata
    const wrapper = document.createElement('div');
    wrapper.style.padding = '20px';
    wrapper.style.background = '#ffffff';
    wrapper.style.width = element.offsetWidth + 'px'; //create a clean printable version
    
    const now = new Date().toLocaleString();
    
    const metaDiv = document.createElement('div');
    metaDiv.innerHTML = `
      <div style="font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; margin-bottom: 16px;">
        <div style="font-size: 18px; font-weight: 700; color: #0f172a;">${title}</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Generated on ${now}</div>
      </div>
    `;
    
    wrapper.appendChild(metaDiv);
    const clonedElement = element.cloneNode(true) as HTMLElement;
    
    // Hide elements with 'export-hide' class before exporting
    const hideElements = clonedElement.querySelectorAll('.export-hide');
    hideElements.forEach((el) => {
      (el as HTMLElement).style.display = 'none';
    });
    
    wrapper.appendChild(clonedElement);//Attach everything to the wrapper
    
    // Temporarily add to document
    wrapper.style.position = 'absolute';
    wrapper.style.left = '-9999px';
    wrapper.style.top = '0';
    document.body.appendChild(wrapper);//Temporarily add to DOM
    
    // Generate canvas from element
    const canvas = await html2canvas(wrapper, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: wrapper.offsetWidth,
      height: wrapper.offsetHeight,
    });
    
    // Remove temporary wrapper
    document.body.removeChild(wrapper);
    
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 190; // A4 width in mm minus margins
    const pageHeight = 277; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 10; // Top margin
    
    // Add first page
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Add additional pages if needed If content is long: It splits into pages
    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Generate filename from title
    const filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.pdf`;
    pdf.save(filename);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
}

// User clicks Export
//         ↓
// handleExportOverallMain()
//         ↓
// Get that DIV using ref
//         ↓
// Send to service
//         ↓
// Clone UI
//         ↓
// Convert to image
//         ↓
// Convert to PDF
//         ↓
// Download file

//React → send data → Django → generate PDF → return file

// Problems (important):
// ❗ Quality depends on screen
// ❗ Layout may break (scroll, overflow, charts)
// ❗ Hard to customize PDF (headers, footers, page numbers)

// Add backend PDF generation (WeasyPrint)
// React UI → Django → HTML template → WeasyPrint → PDF

// ReportLab
// 👉 More control, but harder