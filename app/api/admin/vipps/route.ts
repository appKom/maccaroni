import { type NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import PDFParser from "pdf2json";
import { prisma } from "@/lib/prisma";
import { CollectedType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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
        transaction.name +
        transaction.date +
        transaction.amount +
        transaction.melding +
        transaction.order;
      const existing = await prisma.collected.findUnique({
        where: { id: transactionId },
      });

      const isSilentAuction = transaction.melding === "Stilleauksjon";

      if (!existing && !isSilentAuction) {
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
    revalidatePath("/big-screen");

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

interface Transaction {
  date: string;
  name: string;
  melding: string;
  amount: number;
  order?: number;
}

function parseVippsTransactions(text: string) {
  const transactions: Transaction[] = [];

  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== "");

  const processedLines: string[] = [];
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

  function isPhoneNumber(str: string): boolean {
    return str.startsWith("+47");
  }

  for (let i = 0; i < processedLines.length; i++) {
    const dateTimeMatch = processedLines[i].match(
      /^(\d{2}\.\d{2}\.\d{4}),\s*(\d{2}:\d{2})$/
    );
    if (dateTimeMatch) {
      const date = dateTimeMatch[1];
      i++;

      const nameParts: string[] = [];
      while (i < processedLines.length && !isPhoneNumber(processedLines[i])) {
        nameParts.push(processedLines[i]);
        i++;
      }
      const name = nameParts.join(" ").trim();

      if (i < processedLines.length && isPhoneNumber(processedLines[i])) {
        i++;
      }

      const meldingParts: string[] = [];
      while (
        i < processedLines.length &&
        !processedLines[i].startsWith("Belastet") &&
        !processedLines[i].match(/^(\d{2}\.\d{2}\.\d{4}),\s*(\d{2}:\d{2})$/)
      ) {
        meldingParts.push(processedLines[i]);
        i++;
      }
      let melding = meldingParts.join(" ").trim();

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
        }
      }

      let loddMatch = melding.match(/\bLodd\s*\d+\b/i);

      if (!loddMatch) {
        loddMatch = melding.match(/\bLodd\b/i);
      }

      if (loddMatch) {
        let digits = "1";
        const digitsFound = loddMatch[0].match(/\d+$/);
        if (digitsFound) {
          digits = digitsFound[0];
        }
        melding = `Lodd${digits}`;
      }

      melding = melding.replace(/^Online - Veldedighetsfest\s*/, "");
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

  for (let i = transactions.length - 1, order = 1; i >= 0; i--, order++) {
    transactions[i].order = order;
  }

  return transactions.reverse();
}
