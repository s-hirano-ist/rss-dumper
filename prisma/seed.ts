import { PrismaClient } from "@prisma/client";
import data1 from "./sampleData/AI.json";
import data2 from "./sampleData/education.json";
import data3 from "./sampleData/innovation.json";
import data4 from "./sampleData/interesting.json";

const prisma = new PrismaClient();

async function main() {
  try {
    // UPSERT: if already exists then update, otherwise create
    await prisma.news.upsert({
      where: { id: 1 },
      update: {},
      create: {
        heading: data1.heading,
        description: data1.description,
        newsDetail: {
          create: data1.body,
        },
      },
    });
    await prisma.news.upsert({
      where: { id: 2 },
      update: {},
      create: {
        heading: data2.heading,
        description: data2.description,
        newsDetail: {
          create: data2.body,
        },
      },
    });
    await prisma.news.upsert({
      where: { id: 3 },
      update: {},
      create: {
        heading: data3.heading,
        description: data3.description,
        newsDetail: {
          create: data3.body,
        },
      },
    });
    await prisma.news.upsert({
      where: { id: 4 },
      update: {},
      create: {
        heading: data4.heading,
        description: data4.description,
        newsDetail: {
          create: data4.body,
        },
      },
    });
    console.log("added sample data to the database");
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
