import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { ValidationError } from "joi";
import sanitizeHtml from "sanitize-html";
import { Controller, Get, Route, Path } from "tsoa";
import {
  allNewsService,
  newsByHeadingService,
  newsAndNewsDetailByHeadingService,
} from "../services/newsService";
import { prismaError, unknownError, validationError } from "../utils/error";
import { sendInfoResponse } from "../utils/response";
import { newsPostSchema, newsPatchSchema } from "../utils/schema";

const prisma = new PrismaClient();

@Route("v1/news")
export class NewsController extends Controller {
  @Get("")
  public async getAllNews() {
    return allNewsService(this);
  }

  @Get(":heading")
  public async getNewsByHeading(@Path() heading: string) {
    return newsByHeadingService(heading, this);
  }

  @Get(":heading/all")
  public async getNewsAndNewsDetailByHeading(@Path() heading: string) {
    return newsAndNewsDetailByHeadingService(heading, this);
  }
}

export const createNews = async (request: Request, response: Response) => {
  try {
    const validatedValue = await newsPostSchema.validateAsync(request.body, {
      abortEarly: false,
    });
    const heading = sanitizeHtml(validatedValue.heading as string);
    const description = sanitizeHtml(validatedValue.description as string);

    const data = await prisma.news.create({
      data: { heading, description },
      select: { heading: true, description: true },
    });
    response.status(201).json(data);
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

export const updateNewsByHeading = async (
  request: Request,
  response: Response,
) => {
  try {
    const validatedValue = await newsPatchSchema.validateAsync(request.body, {
      abortEarly: false,
    });
    const description = sanitizeHtml(validatedValue.description as string);
    const heading = request.params.heading;
    await prisma.news.update({
      where: { heading },
      data: { description },
    });
    sendInfoResponse(response, 200, `Updated ${heading}`);
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

export const deleteAllNews = async (_: Request, response: Response) => {
  try {
    await prisma.news.deleteMany();
    sendInfoResponse(response, 200, "Deleted all");
  } catch (error) {
    /* istanbul ignore next */
    unknownError(response, error);
  }
};

export const deleteNewsByHeading = async (
  request: Request,
  response: Response,
) => {
  try {
    const heading = request.params.heading;
    await prisma.news.delete({
      where: { heading },
    });
    sendInfoResponse(response, 200, `Deleted ${heading}`);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      prismaError(response, error);
    } else {
      /* istanbul ignore next */
      unknownError(response, error);
    }
  }
};
