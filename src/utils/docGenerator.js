// src/utils/docGenerator.js
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

export const generateDOC = async (data) => {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          children: [new TextRun({
            text: `${data.personalInfo.firstName} ${data.personalInfo.lastName}`,
            bold: true,
            size: 32,
          })],
        }),
        // Add paragraphs for each section similarly
        // For example:
        new Paragraph({
          children: [new TextRun('Work Experience')],
        }),
        ...data.workExperience.flatMap(exp => [
          new Paragraph(exp.position + ' at ' + exp.companyName),
          new Paragraph(exp.from + ' - ' + (exp.to || 'Present')),
          ...exp.description.map(desc => new Paragraph('• ' + desc)),
        ]),
        // Add for other sections
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${data.personalInfo.firstName || 'resume'}_${data.personalInfo.lastName || ''}_resume.docx`);
};