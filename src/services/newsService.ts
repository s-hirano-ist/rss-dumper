import { Prisma, PrismaClient } from "@prisma/client";
import { NewsController } from "../controllers/newsController";
import { prismaError2, unknownError2 } from "../utils/error";

const prisma = new PrismaClient();

export const allNewsService = async (controller: NewsController) => {
  try {
    return await prisma.news.findMany({
      select: { id: true, heading: true, description: true },
    });
  } catch (error) {
    /* istanbul ignore next */
    return unknownError2(controller, error);
  }
};

export const newsByHeadingService = async (
  heading: string,
  controller: NewsController,
) => {
  return await getNews(heading, false, controller);
};

export const newsAndNewsDetailByHeadingService = async (
  heading: string,
  controller: NewsController,
) => {
  return await getNews(heading, true, controller);
};

const getNews = async (
  heading: string,
  showNewsDetail: boolean,
  controller: NewsController,
) => {
  try {
    return await prisma.news.findUniqueOrThrow({
      where: { heading },
      select: { heading: true, description: true, newsDetail: showNewsDetail },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return prismaError2(controller, error);
    } else {
      /* istanbul ignore next */
      return unknownError2(controller, error);
    }
  }
};
