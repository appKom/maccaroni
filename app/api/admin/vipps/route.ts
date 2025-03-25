import { type NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import PDFParser from "pdf2json";
import { prisma } from "@/lib/prisma";
import { CollectedType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    // Get the PDF file from the request
    const formData = await request.formData();
    const uploadedFile = formData.get("pdf") as File;

    let fileName = "";
    let parsedText = "";

    if (!uploadedFile || uploadedFile.type !== "application/pdf") {
      console.error("Invalid file format. Expected PDF.");
      return NextResponse.json(
        { error: "Please upload a valid PDF file" },
        { status: 400 }
      );
    }

    if (uploadedFile instanceof File) {
      fileName = uuidv4();

      const tempFilePath = `/tmp/${fileName}.pdf`;

      const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());

      await fs.writeFile(tempFilePath, fileBuffer);

      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfParser = new (PDFParser as any)(null, 1);

      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      pdfParser.on("pdfParser_dataError", (errData: any) =>
        console.error(errData.parserError)
      );

      pdfParser.on("pdfParser_dataReady", () => {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        parsedText = (pdfParser as any).getRawTextContent();
      });

      await new Promise((resolve, reject) => {
        pdfParser.loadPDF(tempFilePath);
        pdfParser.on("pdfParser_dataReady", resolve);
        pdfParser.on("pdfParser_dataError", reject);
      });
    } else {
      console.error("Uploaded file is not in the expected format.");
      return new NextResponse("Uploaded file is not in the expected format.", {
        status: 500,
      });
    }

    const transactions = parseVippsTransactions(parsedText);

    console.log(transactions);

    const savedTransactions = [];
    for (const transaction of transactions) {
      const transactionId =
        transaction.name + transaction.date + transaction.amount;
      const existing = await prisma.collected.findUnique({
        where: { id: transactionId },
      });
      if (!existing) {
        savedTransactions.push(
          await prisma.collected.create({
            data: {
              amount: transaction.amount,
              nameOfBidder: transaction.name,
              emailOfBidder: null,
              type: CollectedType.VIPPS,
              id: transactionId,
              description: transaction.melding,
            },
          })
        );
      }
    }

    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${savedTransactions.length} transactions`,
      transactions: savedTransactions,
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      {
        error: `Failed to process PDF: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 500 }
    );
  }
}

function parseVippsTransactions(text: string) {
  const transactions = [];

  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== "");

  const processedLines = [];
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (line.endsWith(",")) {
      if (i + 1 < lines.length) {
        line = line + " " + lines[i + 1];
        i++;
      }
    }
    processedLines.push(line);
  }

  function isPhoneNumber(str: string) {
    return str.startsWith("+47");
  }

  for (let i = 0; i < processedLines.length; i++) {
    const dateTimeMatch = processedLines[i].match(
      /^(\d{2}\.\d{2}\.\d{4}),\s*(\d{2}:\d{2})$/
    );
    if (dateTimeMatch) {
      const date = dateTimeMatch[1];
      i++;
      const nameParts = [];
      while (i < processedLines.length && !isPhoneNumber(processedLines[i])) {
        nameParts.push(processedLines[i]);
        i++;
      }
      const name = nameParts.join(" ");

      if (i < processedLines.length && isPhoneNumber(processedLines[i])) {
        i++;
      }

      const meldingParts = [];
      while (
        i < processedLines.length &&
        !processedLines[i].startsWith("Belastet") &&
        !processedLines[i].match(/^(\d{2}\.\d{2}\.\d{4}),\s*(\d{2}:\d{2})$/)
      ) {
        meldingParts.push(processedLines[i]);
        i++;
      }
      let melding = meldingParts.join(" ");

      // Default amount to 0
      let amount = 0;

      if (
        i < processedLines.length &&
        processedLines[i].startsWith("Belastet")
      ) {
        const belMatch = processedLines[i].match(/^Belastet\s*(\d+)/);
        if (belMatch) {
          amount = parseInt(belMatch[1], 10);
        }
      } else {
        const belInMeldingMatch = melding.match(/Belastet\s*(\d+)/);
        if (belInMeldingMatch) {
          amount = parseInt(belInMeldingMatch[1], 10);
          melding = melding.replace(/Belastet\s*\d+/, "").trim();

          const loddMatch = melding.match(/Lodd\s*(\d+)/);
          if (loddMatch) {
            melding = "Lodd";
          }
        }
      }

      // Push the transaction
      transactions.push({
        date,
        name,
        melding,
        amount,
      });

      if (
        i < processedLines.length &&
        processedLines[i].startsWith("Belastet")
      ) {
        i++;
      }

      i--;
    }
  }

  return transactions;
}
