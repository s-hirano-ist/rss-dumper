import {
  Controller,
  Get,
  Route,
  Path,
  Post,
  Patch,
  Body,
  SuccessResponse,
  Delete,
} from "tsoa";
import {
  getAllNewsService,
  getNewsByHeadingService,
  getNewsAndNewsDetailByHeadingService,
  createNewsService,
  updateNewsByHeadingService,
  deleteAllNewsService,
  deleteNewsByHeadingService,
} from "../services/newsService";

@Route("v1/news")
export class NewsController extends Controller {
  @Get()
  public async getAllNews() {
    return getAllNewsService(this);
  }

  @Get("{heading}")
  public async getNewsByHeading(@Path() heading: string) {
    return getNewsByHeadingService(heading, this);
  }
  @Get("{heading}/all")
  public async getNewsAndNewsDetailByHeading(@Path() heading: string) {
    return getNewsAndNewsDetailByHeadingService(heading, this);
  }

  @SuccessResponse("201", "Created")
  @Post("create")
  public async createNews(@Body() requestBody: any) {
    // TODO: may be better to validate here
    return createNewsService(requestBody, this);
  }

  @SuccessResponse("200", "Updated")
  @Patch("update/{heading}")
  public async updateNewsByHeading(
    @Path() heading: string,
    @Body() requestBody: any,
  ) {
    return updateNewsByHeadingService(heading, requestBody, this);
  }

  @SuccessResponse("200", "Deleted")
  @Delete("delete")
  public async deleteAllNews() {
    return deleteAllNewsService(this);
  }

  @SuccessResponse("200", "Deleted")
  @Delete("delete/{heading}")
  public async deleteNewsByHeading(@Path() heading: string) {
    return deleteNewsByHeadingService(heading, this);
  }
}
