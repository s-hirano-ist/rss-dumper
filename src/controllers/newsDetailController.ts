import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { ValidationError } from "joi";
import sanitizeHtml from "sanitize-html";
import { prismaError, unknownError, validationError } from "../utils/error";
import {
  idSchema,
  newsAndNewsDetailPostSchema,
  newsDetailPostSchema,
} from "../utils/schema";

const prisma = new PrismaClient();

export const getAllNewsDetail = async (_: Request, response: Response) => {
  try {
    const allNewsDetail = await prisma.newsDetail.findMany({
      select: { title: true, url: true },
    });
    response.status(200).json(allNewsDetail);
  } catch (error) {
    /* istanbul ignore next */
    unknownError(response, error);
  }
};

export const getNewsDetailById = async (
  request: Request,
  response: Response,
) => {
  try {
    const validatedValue = await idSchema.validateAsync(request.params, {
      abortEarly: false,
    });

    const newsDetail = await prisma.newsDetail.findUniqueOrThrow({
      where: { id: validatedValue.id },
      select: {
        title: true,
        url: true,
        favorite: true,
        published: true,
        quote: true,
        newsId: true,
      },
    });
    response.status(200).json(newsDetail);
  } catch (error) {
    if (error instanceof ValidationError) {
      validationError(response, error.message);
    } else if (error instanceof Prisma.PrismaClientKnownRequestError)
      prismaError(response, error);
    else {
      /* istanbul ignore next */
      unknownError(response, error);
    }
  }
};

export const createNewsDetailByNewsHeading = async (
  request: Request,
  response: Response,
) => {
  try {
    const validatedValue = await newsDetailPostSchema.validateAsync(
      request.body,
      { abortEarly: false },
    );
    const title = sanitizeHtml(validatedValue.title as string);
    const url = sanitizeHtml(validatedValue.url as string);
    const quote = validatedValue.quote as string; // FIXME: need sanitizing in frontend due to inline HTML

    const news = await prisma.news.findUniqueOrThrow({
      where: { heading: request.params.heading },
      select: { id: true },
    });

    const newsDetail = await prisma.newsDetail.create({
      data: { title, url, quote, newsId: news.id },
      select: { title: true, url: true, quote: true },
    });
    response.status(201).json(newsDetail);
  } catch (error) {
    if (error instanceof ValidationError) {
      validationError(response, error.message);
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      prismaError(response, error);
    } else {
      /* istanbul ignore next */
      unknownError(response, error);
    }
  }
};

export const createNewsAndNewsDetail = async (
  request: Request,
  response: Response,
) => {
  try {
    const validatedValue = await newsAndNewsDetailPostSchema.validateAsync(
      request.body,
      { abortEarly: false },
    );
    const heading = sanitizeHtml(validatedValue.heading as string);
    const description = sanitizeHtml(validatedValue.description as string);

    const title = sanitizeHtml(validatedValue.title as string);
    const url = sanitizeHtml(validatedValue.url as string);
    const quote = validatedValue.quote as string; // FIXME: need sanitizing in frontend due to inline HTML

    const news = await prisma.news.create({
      data: { heading, description },
      select: { id: true },
    });
    const newsDetail = await prisma.newsDetail.create({
      data: { title, url, quote, newsId: news.id },
      select: { title: true, url: true, quote: true },
    });
    response.status(201).json(newsDetail);
  } catch (error) {
    if (error instanceof ValidationError) {
      validationError(response, error.message);
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      prismaError(response, error);
    } else {
      /* istanbul ignore next */
      unknownError(response, error);
    }
  }
};

// export const updateNewsDetailById = async (
//   request: Request,
//   response: Response,
// ) => {};

// export const deleteAllNewsDetail = async (
//   request: Request,
//   response: Response,
// ) => {};

// export const deleteNewsDetailById = async (
//   request: Request,
//   response: Response,
// ) => {};
