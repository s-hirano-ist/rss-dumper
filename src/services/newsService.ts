import { Prisma, PrismaClient } from "@prisma/client";
import { ValidationError } from "joi";
import sanitizeHtml from "sanitize-html";
import { NewsController } from "../controllers/newsController";
import { prismaError2, unknownError2, validationError2 } from "../utils/error";
import { sendInfoResponse2 } from "../utils/response";
import { newsPostSchema, newsPatchSchema } from "../utils/schema";

const prisma = new PrismaClient();

export const getAllNewsService = async (controller: NewsController) => {
  try {
    return await prisma.news.findMany({
      select: { id: true, heading: true, description: true },
    });
  } catch (error) {
    /* istanbul ignore next */
    return unknownError2(controller, error);
  }
};

export const getNewsByHeadingService = async (
  heading: string,
  controller: NewsController,
) => {
  return await getNews(heading, false, controller);
};

export const getNewsAndNewsDetailByHeadingService = async (
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

export const createNewsService = async (
  requestBody: any,
  controller: NewsController,
) => {
  try {
    const validatedValue = await newsPostSchema.validateAsync(requestBody, {
      abortEarly: false,
    });
    const heading = sanitizeHtml(validatedValue.heading as string);
    const description = sanitizeHtml(validatedValue.description as string);

    const data = await prisma.news.create({
      data: { heading, description },
      select: { heading: true, description: true },
    });
    controller.setStatus(201);
    return data;
  } catch (error) {
    if (error instanceof ValidationError) {
      return validationError2(controller, error.message);
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return prismaError2(controller, error);
    } else {
      /* istanbul ignore next */
      return unknownError2(controller, error);
    }
  }
};

export const updateNewsByHeadingService = async (
  heading: string,
  requestBody: any,
  controller: NewsController,
) => {
  try {
    const validatedValue = await newsPatchSchema.validateAsync(requestBody, {
      abortEarly: false,
    });
    const description = sanitizeHtml(validatedValue.description as string);
    await prisma.news.update({
      where: { heading },
      data: { description },
    });
    return sendInfoResponse2(controller, 200, `Updated ${heading}`);
  } catch (error) {
    if (error instanceof ValidationError) {
      return validationError2(controller, error.message);
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return prismaError2(controller, error);
    } else {
      /* istanbul ignore next */
      return unknownError2(controller, error);
    }
  }
};

export const deleteAllNewsService = async (controller: NewsController) => {
  try {
    await prisma.news.deleteMany();
    return sendInfoResponse2(controller, 200, "Deleted all");
  } catch (error) {
    /* istanbul ignore next */
    return unknownError2(controller, error);
  }
};

export const deleteNewsByHeadingService = async (
  heading: string,
  controller: NewsController,
) => {
  try {
    await prisma.news.delete({
      where: { heading },
    });
    return sendInfoResponse2(controller, 200, `Deleted ${heading}`);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return prismaError2(controller, error);
    } else {
      /* istanbul ignore next */
      return unknownError2(controller, error);
    }
  }
};
