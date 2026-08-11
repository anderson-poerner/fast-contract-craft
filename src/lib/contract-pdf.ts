import jsPDF from "jspdf";

export interface SignatureStamp {
  name: string | null;
  cpf: string | null;
  ip: string | null;
  signedAt: string | null;
  id: string;
}

export function downloadContractPdf(
  contract: { title: string; paragraphs: string[] },
  signature?: SignatureStamp | null,
  fileName = "contrato.pdf",
) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 60;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  const ensureSpace = (h: number) => {
    if (y + h > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  doc.setFont("times", "bold");
  doc.setFontSize(14);
  const titleLines = doc.splitTextToSize(contract.title, maxWidth);
  doc.text(titleLines, pageWidth / 2, y, { align: "center" });
  y += titleLines.length * 18 + 12;

  doc.setFont("times", "normal");
  doc.setFontSize(11);

  for (const p of contract.paragraphs) {
    const isHeading = /^CLÁUSULA/.test(p);
    doc.setFont("times", isHeading ? "bold" : "normal");
    const lines = doc.splitTextToSize(p, maxWidth);
    const blockH = lines.length * 15 + 10;
    ensureSpace(blockH);
    doc.text(lines, margin, y, { align: isHeading ? "left" : "justify", maxWidth });
    y += blockH;
  }

  if (signature) {
    const stampLines = [
      "ASSINATURA ELETRÔNICA — REGISTRO DIGITAL",
      `Assinado por: ${signature.name ?? "—"}`,
      `CPF: ${signature.cpf ?? "—"}`,
      `Data/Hora: ${
        signature.signedAt
          ? new Date(signature.signedAt).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }) +
            " (horário de Brasília)"
          : "—"
      }`,
      `Endereço IP: ${signature.ip || "não capturado"}`,
      `ID do contrato: ${signature.id}`,
    ];
    const legal =
      "Este documento foi aceito eletronicamente nos termos do art. 10, § 2º da MP nº 2.200-2/2001, que reconhece a validade jurídica de assinaturas eletrônicas mediante comprovação de autoria e integridade.";
    const legalLines = doc.splitTextToSize(legal, maxWidth - 24);

    const boxH = stampLines.length * 15 + legalLines.length * 12 + 34;
    ensureSpace(boxH + 20);
    y += 16;
    doc.setDrawColor(30);
    doc.setLineWidth(1);
    doc.rect(margin, y, maxWidth, boxH);

    let ty = y + 20;
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.text(stampLines[0], margin + 12, ty);
    ty += 16;
    doc.setFont("times", "normal");
    for (const line of stampLines.slice(1)) {
      doc.text(line, margin + 12, ty);
      ty += 15;
    }
    doc.setFontSize(9);
    doc.text(legalLines, margin + 12, ty + 4);
    y += boxH;
  }

  doc.save(fileName);
}
