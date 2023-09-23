import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { ValidationError } from "joi";
import { prismaError, unknownError, validationError } from "../utils/error";
import { sendInfoResponse } from "../utils/response";
import { newsPostSchema, newsPatchSchema } from "../utils/schema";

const prisma = new PrismaClient();

export const getAllNews = async (_: Request, response: Response) => {
  try {
    const allNews = await prisma.news.findMany({
      select: { title: true, description: true },
    });
    response.status(200).json(allNews);
  } catch (error) {
    unknownError(response, error);
  }
};

export const getNewsByTitle = async (request: Request, response: Response) => {
  try {
    const news = await prisma.news.findUniqueOrThrow({
      where: { title: request.params.title },
      select: { title: true, description: true },
    });
    response.status(200).json(news);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError)
      prismaError(response, error);
    else unknownError(response, error);
  }
};

export const createNews = async (request: Request, response: Response) => {
  try {
    const validatedValue = await newsPostSchema.validateAsync(request.body, {
      abortEarly: false,
    });

    const data = await prisma.news.create({
      data: {
        title: validatedValue.title,
        description: validatedValue.description,
      },
      select: { title: true, description: true },
    });
    response.status(201).json(data);
  } catch (error) {
    if (error instanceof ValidationError) {
      validationError(response, error.message);
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      prismaError(response, error);
    } else {
      unknownError(response, error);
    }
  }
};

export const updateNewsByTitle = async (
  request: Request,
  response: Response,
) => {
  try {
    const validatedValue = await newsPatchSchema.validateAsync(request.body, {
      abortEarly: false,
    });
    const data = await prisma.news.update({
      where: { title: request.params.title },
      data: {
        description: validatedValue.description,
      },
    });
    sendInfoResponse(response, 200, `Updated ${data.title}`);
  } catch (error) {
    if (error instanceof ValidationError) {
      validationError(response, error.message);
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      prismaError(response, error);
    } else {
      unknownError(response, error);
    }
  }
};

export const deleteAllNews = async (_: Request, response: Response) => {
  try {
    await prisma.news.deleteMany();
    sendInfoResponse(response, 200, "Deleted all");
  } catch (error) {
    unknownError(response, error);
  }
};

export const deleteNewsByTitle = async (
  request: Request,
  response: Response,
) => {
  try {
    const data = await prisma.news.delete({
      where: { title: request.params.title },
    });
    sendInfoResponse(response, 200, `Deleted ${data.title}`);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError)
      prismaError(response, error);
    else unknownError(response, error);
  }
};
