import { Controller, Get, Route } from "tsoa";
import { healthService } from "../services/healthService";

@Route("health")
export class HealthController extends Controller {
  @Get()
  public async getHealth(): Promise<string> {
    return healthService();
  }
}
