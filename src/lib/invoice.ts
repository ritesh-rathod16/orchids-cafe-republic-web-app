import jsPDF from "jspdf";
import "jspdf-autotable";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export type InvoiceData = {
  invoiceNumber: string;
  tableNumber: number;
  date: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  paymentMode: string;
};

export const generateInvoicePDF = (data: InvoiceData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("CAFE REPUBLIC", pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("123 Coffee Lane, Koramangala, Bangalore", pageWidth / 2, 28, { align: "center" });
  doc.text("Contact: +91 98765 43210", pageWidth / 2, 33, { align: "center" });

  doc.setLineWidth(0.5);
  doc.line(20, 40, pageWidth - 20, 40);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`INVOICE: ${data.invoiceNumber}`, 20, 50);
  doc.text(`TABLE: ${data.tableNumber}`, pageWidth - 20, 50, { align: "right" });
  
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${data.date}`, 20, 58);
  doc.text(`Payment: ${data.paymentMode.toUpperCase()}`, pageWidth - 20, 58, { align: "right" });

  const tableData = data.items.map((item) => [
    item.name,
    item.quantity.toString(),
    `₹${item.price.toFixed(0)}`,
    `₹${(item.quantity * item.price).toFixed(0)}`,
  ]);

  doc.autoTable({
    startY: 70,
    head: [["Item", "Qty", "Price", "Amount"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [74, 55, 40], textColor: [236, 216, 182] },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL AMOUNT: ₹${data.total.toFixed(0)}`, pageWidth - 20, finalY, { align: "right" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text("Thank you for visiting Cafe Republic!", pageWidth / 2, finalY + 20, { align: "center" });

  doc.save(`Invoice_${data.invoiceNumber}.pdf`);
};
