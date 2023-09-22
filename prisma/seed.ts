import { PrismaClient } from "@prisma/client";
import { create } from "domain";
const prisma = new PrismaClient();

// TODO: insert more clean data
async function main() {
  try {
    const sampleData1 = await prisma.news.create({
      // MEMO: UPSERT: if already exists then update, otherwise create
      data: {
        title: "A",
        description: "sample A",
        newsDetail: {
          create: [{ title: "sample detail A", url: "https://google.com" }],
        },
      },
    });

    const sampleData2 = await prisma.news.upsert({
      where: { id: 2 },
      update: {},
      create: {
        title: "B",
        description: "sample B",
        newsDetail: {
          create: [{ title: "sample detail B", url: "https://google.com" }],
        },
      },
    });

    const sampleData3 = await prisma.news.upsert({
      where: { id: 3 },
      update: {},
      create: {
        title: "C",
        description: "sample C",
        newsDetail: {
          create: [{ title: "sample detail C", url: "https://google.com" }],
        },
      },
    });

    console.log({ sampleData1, sampleData2, sampleData3 });
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
