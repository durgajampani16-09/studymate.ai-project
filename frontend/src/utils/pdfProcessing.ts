import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

/**
 * Extracts text from each page of a PDF file.
 * Returns an array of chunks where each chunk contains page number and full page text.
 */
export async function extractPdfChunks(file: File): Promise<{ page: number; text: string }[]> {
  const arrayBuffer = await file.arrayBuffer();
  const uint8 = new Uint8Array(arrayBuffer);
  const loadingTask = pdfjs.getDocument({ data: uint8 });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const chunks: { page: number; text: string }[] = [];
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => (item.str ? item.str : ''));
    const pageText = strings.join(' ');
    chunks.push({ page: i, text: pageText });
  }
  return chunks;
}
