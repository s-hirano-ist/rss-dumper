import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
  ValidationError,
  notFoundError,
  prismaError,
  unknownError,
  validationError,
} from "../utils/error";
import { validateString } from "../utils/validation";

const prisma = new PrismaClient();

export const getAllNews = async (_: Request, response: Response) => {
  try {
    const allNews = await prisma.news.findMany({
      select: { title: true, description: true },
    });
    response.status(200).json(allNews);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      prismaError(response, error);
    } else {
      unknownError(response, error);
    }
    return;
  }
  return;
};

export const getNewsByTitle = async (request: Request, response: Response) => {
  try {
    const news = await prisma.news.findUnique({
      where: { title: request.params.title },
      select: { title: true, description: true },
    });
    if (news === null) notFoundError(response);
    else response.status(200).json(news);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      prismaError(response, error);
    } else {
      unknownError(response, error);
    }
  }
};

export const createNews = async (request: Request, response: Response) => {
  try {
    const title = validateString(request.body.title);
    const description = validateString(request.body.description);
    const data = await prisma.news.create({
      data: { title, description },
      select: { title: true, description: true },
    });
    response.status(201).json(data);
  } catch (error) {
    if (error instanceof ValidationError) {
      validationError(response, error.name);
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
    const description = validateString(request.body.description);
    const data = await prisma.news.update({
      where: { title: request.params.title },
      data: {
        description,
      },
    });
    response.status(200).json({
      message: `Updated ${data.title}`,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      validationError(response, error.name);
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
    response.status(200).json({
      message: "Deleted all",
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      prismaError(response, error);
    } else {
      unknownError(response, error);
    }
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
    response.status(200).json({
      message: `Deleted ${data.title}`,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      prismaError(response, error);
    } else {
      unknownError(response, error);
    }
  }
};
