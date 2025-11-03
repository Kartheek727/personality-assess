// src/utils/pdfGenerator.ts
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import toast from "react-hot-toast";
import {
  IAssessmentResponse,
  IUser,
  IPDFLogo,
  IResponse,
} from "@/types/backendTypes";

const DEFAULT_AVATAR_URL = "/UserIcon.png";
const DEFAULT_PDF_LOGO_URL = "/logo.png";
const BORDER_IMAGE_URL =
  "https://res.cloudinary.com/dt9diynji/image/upload/v1742730937/skyblue_lolm35.png";

export const generatePDF = async (
  response: IAssessmentResponse,
  user: IUser | null,
  pdfLogo: IPDFLogo | null
): Promise<void> => {
  try {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    // Fetch font files
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const poppinsRegularUrl = `${baseUrl}/fonts/Poppins-Regular.ttf`;
    const poppinsBoldUrl = `${baseUrl}/fonts/Poppins-Bold.ttf`;
    const poppinsRegularBytes = await fetch(poppinsRegularUrl).then((res) =>
      res.arrayBuffer()
    );
    const poppinsBoldBytes = await fetch(poppinsBoldUrl).then((res) =>
      res.arrayBuffer()
    );
    const poppinsFont = await pdfDoc.embedFont(poppinsRegularBytes);
    const poppinsBoldFont = await pdfDoc.embedFont(poppinsBoldBytes);

    const sanitizeText = (text: string): string => {
      return text.replace(/[^\x20-\x7E\n]/g, "").trim();
    };

    // Handle image URLs with fallbacks
    const fullLogoUrl = pdfLogo?.url?.startsWith("http")
      ? pdfLogo.url
      : `${baseUrl}${pdfLogo?.url || DEFAULT_PDF_LOGO_URL}`;
    const fullAvatarUrl = user?.profilePicture?.startsWith("http")
      ? user.profilePicture
      : `${baseUrl}${user?.profilePicture || DEFAULT_AVATAR_URL}`;
    const fullBgUrl = BORDER_IMAGE_URL;

    const logoImageBytes = await fetch(fullLogoUrl).then((res) =>
      res.arrayBuffer()
    );
    const avatarImageBytes = await fetch(fullAvatarUrl).then((res) =>
      res.arrayBuffer()
    );
    const bgImageBytes = await fetch(fullBgUrl).then((res) =>
      res.arrayBuffer()
    );
    const logoImage = await pdfDoc.embedPng(logoImageBytes);
    const avatarImage = await pdfDoc.embedPng(avatarImageBytes);
    const bgImage = await pdfDoc.embedPng(bgImageBytes);

    // Page setup
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const margin = 40;
    const contentWidth = pageWidth - 2 * margin;

    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    page.drawImage(bgImage, {
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight,
    });
    page.drawRectangle({
      x: margin,
      y: margin,
      width: contentWidth,
      height: pageHeight - 2 * margin,
      color: rgb(1, 1, 1),
    });

    // Header
    let yOffset = pageHeight - margin - 80;
    page.drawImage(logoImage, {
      x: (pageWidth - 250) / 2,
      y: yOffset - 30,
      width: 250,
      height: 89,
    });
    yOffset -= 70;

    const titleText = (pdfLogo?.title || "Mind Avenues").toUpperCase();
    page.drawText(titleText, {
      x: (pageWidth - poppinsBoldFont.widthOfTextAtSize(titleText, 36)) / 2,
      y: yOffset,
      size: 36,
      font: poppinsBoldFont,
      color: rgb(0.102, 0.384, 0.643),
    });
    yOffset -= 25;

    page.drawText(pdfLogo?.subtitle || "Potential Systems Private Limited", {
      x:
        (pageWidth -
          poppinsFont.widthOfTextAtSize(
            pdfLogo?.subtitle || "Potential Systems Private Limited",
            12
          )) /
        2,
      y: yOffset,
      size: 12,
      font: poppinsFont,
      color: rgb(0.016, 0.329, 0.58),
    });
    yOffset -= 15;

    page.drawLine({
      start: { x: margin + 100, y: yOffset },
      end: { x: pageWidth - margin - 100, y: yOffset },
      thickness: 1,
      color: rgb(0.102, 0.384, 0.643),
    });
    yOffset -= 15;

    page.drawText(
      pdfLogo?.tagline || "The Path to Positive Self-Transformation",
      {
        x:
          (pageWidth -
            poppinsFont.widthOfTextAtSize(
              pdfLogo?.tagline || "The Path to Positive Self-Transformation",
              10
            )) /
          2,
      y: yOffset,
      size: 10,
      font: poppinsFont,
      color: rgb(0.016, 0.329, 0.58),
      }
    );
    yOffset -= 30;

    // User avatar and intro
    page.drawImage(avatarImage, {
      x: margin + 30,
      y: yOffset - 70,
      width: 85,
      height: 85,
    });

    const userFullName = user
      ? `${user.firstName || "User"} ${user.lastName || ""}`.trim()
      : "User";
    const introText = `Dear ${userFullName}, this psychological assessment tool is supported by a predesigned ten-step approach which thus enables you to understand and gradually bring about changes in your inner mind configuration. The Inner Mind Map is a way to understand why you are the way you are. Your psychological configuration can be understood holistically through this profile and helps you to identify the blocks in your mind-brain connect, empowering you to overcome these internal blocks with insight and willpower. We hope this profile will help you realize your true potential and become a happier person.`;
    const avatarBottom = yOffset - 85;
    const introLinesNarrow = splitTextToFit(
      introText,
      contentWidth - 140,
      12,
      poppinsFont
    );
    const maxLinesNextToAvatar = Math.floor(94 / 14);
    let remainingText = "";
    if (introLinesNarrow.length > maxLinesNextToAvatar) {
      const textUsed = introLinesNarrow
        .slice(0, maxLinesNextToAvatar)
        .join(" ");
      const textArray = introText.split(" ");
      const usedWords = textUsed.split(" ").length;
      remainingText = textArray.slice(usedWords).join(" ");
    }
    introLinesNarrow.slice(0, maxLinesNextToAvatar).forEach((line, index) => {
      page.drawText(line, {
        x: margin + 120,
        y: yOffset - index * 14,
        size: 12,
        font: poppinsFont,
        color: rgb(0.016, 0.329, 0.58),
      });
    });

    if (remainingText) {
      const introLinesFull = splitTextToFit(
        remainingText,
        contentWidth - 40,
        12,
        poppinsFont
      );
      introLinesFull.forEach((line, index) => {
        page.drawText(line, {
          x: margin + 20,
          y: avatarBottom - index * 14,
          size: 12,
          font: poppinsFont,
          color: rgb(0.016, 0.329, 0.58),
        });
      });
      yOffset = avatarBottom - (introLinesFull.length * 14 + 20);
    } else {
      yOffset -= maxLinesNextToAvatar * 14 + 20;
    }

    // Assessment results
    page.drawText("Your Result", {
      x: (pageWidth - poppinsBoldFont.widthOfTextAtSize("Your Result", 20)) / 2,
      y: yOffset,
      size: 20,
      font: poppinsBoldFont,
      color: rgb(0.102, 0.384, 0.643),
    });
    yOffset -= 30;

    if (response?.responses?.length) {
      response.responses.forEach((resp: IResponse, index) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(resp.content, "text/html");
        const elements = Array.from(doc.body.childNodes);

        elements.forEach((node) => {
          if (node.nodeName === "H1") {
            const text = sanitizeText(node.textContent || "");
            const height = 30;
            if (yOffset - height < margin) {
              page = pdfDoc.addPage([pageWidth, pageHeight]);
              page.drawImage(bgImage, { x: 0, y: 0, width: pageWidth, height: pageHeight });
              page.drawRectangle({
                x: margin,
                y: margin,
                width: contentWidth,
                height: pageHeight - 2 * margin,
                color: rgb(1, 1, 1),
              });
              yOffset = pageHeight - margin - 20;
            }
            page.drawText(text, {
              x: margin + 20,
              y: yOffset,
              size: 20,
              font: poppinsBoldFont,
              color: rgb(0.102, 0.384, 0.643),
            });
            yOffset -= height;
          } else if (node.nodeName === "H2") {
            const text = sanitizeText(node.textContent || "");
            const height = 25;
            if (yOffset - height < margin) {
              page = pdfDoc.addPage([pageWidth, pageHeight]);
              page.drawImage(bgImage, { x: 0, y: 0, width: pageWidth, height: pageHeight });
              page.drawRectangle({
                x: margin,
                y: margin,
                width: contentWidth,
                height: pageHeight - 2 * margin,
                color: rgb(1, 1, 1),
              });
              yOffset = pageHeight - margin - 20;
            }
            page.drawText(text, {
              x: margin + 20,
              y: yOffset,
              size: 16,
              font: poppinsBoldFont,
              color: rgb(0.102, 0.384, 0.643),
            });
            yOffset -= height;
          } else if (node.nodeName === "H3") {
            const text = sanitizeText(node.textContent || "");
            const height = 20;
            if (yOffset - height < margin) {
              page = pdfDoc.addPage([pageWidth, pageHeight]);
              page.drawImage(bgImage, { x: 0, y: 0, width: pageWidth, height: pageHeight });
              page.drawRectangle({
                x: margin,
                y: margin,
                width: contentWidth,
                height: pageHeight - 2 * margin,
                color: rgb(1, 1, 1),
              });
              yOffset = pageHeight - margin - 20;
            }
            page.drawText(text, {
              x: margin + 20,
              y: yOffset,
              size: 14,
              font: poppinsBoldFont,
              color: rgb(0.102, 0.384, 0.643),
            });
            yOffset -= height;
          } else if (node.nodeName === "P") {
            const paragraphLines = [];
            const childNodes = Array.from(node.childNodes);

            if (childNodes.length === 1 && childNodes[0].nodeName === "#text") {
              const text = sanitizeText(node.textContent || "");
              const lines = splitTextToFit(text, contentWidth - 40, 12, poppinsFont);
              paragraphLines.push({ lines, isBold: false });
            } else {
              let currentText = "";
              let isBold = false;
              childNodes.forEach((child) => {
                if (child.nodeName === "#text") {
                  currentText += sanitizeText(child.textContent || "");
                } else if (child.nodeName === "STRONG") {
                  if (currentText) {
                    const lines = splitTextToFit(currentText, contentWidth - 40, 12, poppinsFont);
                    paragraphLines.push({ lines, isBold });
                    currentText = "";
                  }
                  isBold = true;
                  const boldText = sanitizeText(child.textContent || "");
                  const boldLines = splitTextToFit(boldText, contentWidth - 40, 12, poppinsBoldFont);
                  paragraphLines.push({ lines: boldLines, isBold });
                  isBold = false;
                }
              });
              if (currentText) {
                const lines = splitTextToFit(currentText, contentWidth - 40, 12, poppinsFont);
                paragraphLines.push({ lines, isBold });
              }
            }

            const totalHeight = paragraphLines.reduce(
              (sum, { lines }) => sum + lines.length * 14,
              0
            ) + 10;
            if (yOffset - totalHeight < margin) {
              page = pdfDoc.addPage([pageWidth, pageHeight]);
              page.drawImage(bgImage, { x: 0, y: 0, width: pageWidth, height: pageHeight });
              page.drawRectangle({
                x: margin,
                y: margin,
                width: contentWidth,
                height: pageHeight - 2 * margin,
                color: rgb(1, 1, 1),
              });
              yOffset = pageHeight - margin - 20;
            }

            let lineOffset = 0;
            paragraphLines.forEach(({ lines, isBold }) => {
              lines.forEach((line, index) => {
                page.drawText(line, {
                  x: margin + 20,
                  y: yOffset - lineOffset - index * 14,
                  size: 12,
                  font: isBold ? poppinsBoldFont : poppinsFont,
                  color: isBold ? rgb(0.957, 0.459, 0.157) : rgb(0.016, 0.329, 0.58),
                });
              });
              lineOffset += lines.length * 14;
            });
            yOffset -= totalHeight;
          } else if (node.nodeName === "UL") {
            const items = Array.from(node.childNodes).filter((n) => n.nodeName === "LI");
            let totalListHeight = 0;
            const listItemData = items.map((item) => {
              const childNodes = Array.from(item.childNodes);
              const listItemLines: { line: string; isBold: boolean }[] = [];
              let currentText = "";
              let isBold = false;

              childNodes.forEach((child) => {
                if (child.nodeName === "#text") {
                  currentText += sanitizeText(child.textContent || "");
                } else if (child.nodeName === "STRONG") {
                  if (currentText) {
                    const lines = splitTextToFit(currentText, contentWidth - 60, 12, poppinsFont);
                    listItemLines.push(...lines.map((line) => ({ line, isBold })));
                    currentText = "";
                  }
                  isBold = true;
                  const boldText = sanitizeText(child.textContent || "");
                  const boldLines = splitTextToFit(boldText, contentWidth - 60, 12, poppinsBoldFont);
                  listItemLines.push(...boldLines.map((line) => ({ line, isBold: true })));
                  isBold = false;
                }
              });
              if (currentText) {
                const lines = splitTextToFit(currentText, contentWidth - 60, 12, poppinsFont);
                listItemLines.push(...lines.map((line) => ({ line, isBold })));
              }

              const itemHeight = listItemLines.length * 14 + 5;
              totalListHeight += itemHeight;
              return { listItemLines, itemHeight };
            });

            if (yOffset - totalListHeight < margin) {
              page = pdfDoc.addPage([pageWidth, pageHeight]);
              page.drawImage(bgImage, { x: 0, y: 0, width: pageWidth, height: pageHeight });
              page.drawRectangle({
                x: margin,
                y: margin,
                width: contentWidth,
                height: pageHeight - 2 * margin,
                color: rgb(1, 1, 1),
              });
              yOffset = pageHeight - margin - 20;
            }

            listItemData.forEach(({ listItemLines }) => {
              if (listItemLines.length > 0) {
                page.drawText("•", {
                  x: margin + 20,
                  y: yOffset,
                  size: 12,
                  font: poppinsFont,
                  color: rgb(0.016, 0.329, 0.58),
                });
              }
              listItemLines.forEach((itemLine, index) => {
                page.drawText(itemLine.line, {
                  x: margin + 40,
                  y: yOffset - index * 14,
                  size: 12,
                  font: itemLine.isBold ? poppinsBoldFont : poppinsFont,
                  color: itemLine.isBold ? rgb(0.957, 0.459, 0.157) : rgb(0.016, 0.329, 0.58),
                });
              });
              const itemHeight = listItemLines.length * 14 + 5;
              yOffset -= itemHeight;
            });
          }
        });

        // Add horizontal rule between responses
        if (index < response.responses.length - 1) {
          const hrHeight = 20; // 10pt top + 1pt line + 10pt bottom, approximated as 20pt total space
          if (yOffset - hrHeight < margin) {
            page = pdfDoc.addPage([pageWidth, pageHeight]);
            page.drawImage(bgImage, { x: 0, y: 0, width: pageWidth, height: pageHeight });
            page.drawRectangle({
              x: margin,
              y: margin,
              width: contentWidth,
              height: pageHeight - 2 * margin,
              color: rgb(1, 1, 1),
            });
            yOffset = pageHeight - margin - 20;
          }
          yOffset -= 10; // Top margin
          page.drawLine({
            start: { x: margin + 20, y: yOffset },
            end: { x: pageWidth - margin - 20, y: yOffset },
            thickness: 1,
            color: rgb(0.102, 0.384, 0.643),
          });
          yOffset -= 10; // Bottom margin
        }
      });
    }

    // Save and download PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "assessment_result.pdf";
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    toast.error("Error generating PDF");
  }
};

const splitTextToFit = (
  text: string,
  maxWidth: number,
  fontSize: number,
  font: { widthOfTextAtSize: (text: string, size: number) => number }
) => {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);
    if (width <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  });
  if (currentLine) lines.push(currentLine);
  return lines;
};