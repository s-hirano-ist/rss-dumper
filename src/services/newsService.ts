import { Prisma, PrismaClient } from "@prisma/client";
// import { prismaError, unknownError } from "../utils/error";

const prisma = new PrismaClient();

export const allNewsService = async () => {
  try {
    return await prisma.news.findMany({
      select: { id: true, heading: true, description: true },
    });
  } catch (error) {
    /* istanbul ignore next */ //TODO:
    // unknownError(response, error);
    console.log("error", error);
    return [];
  }
};

export const newsByHeadingService = async (heading: string) => {
  return await getNews(heading, false);
};

export const newsAndNewsDetailByHeadingService = async (heading: string) => {
  return await getNews(heading, true);
};

const getNews = async (heading: string, showNewsDetail: boolean) => {
  try {
    return await prisma.news.findUniqueOrThrow({
      where: { heading },
      select: { heading: true, description: true, newsDetail: showNewsDetail },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // TODO:
      //   prismaError(response, error);
    } else {
      // TODO:
      /* istanbul ignore next */
      //   unknownError(response, error);
    }
    return [];
  }
};
