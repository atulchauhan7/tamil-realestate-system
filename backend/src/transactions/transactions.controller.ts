import {
  Controller,
  Post,
  Get,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TransactionsService } from './transactions.service';

class SearchTransactionsQueryDto {
  buyerName?: string;
  sellerName?: string;
  houseNumber?: string;
  surveyNumber?: string;
  documentNumber?: string;
}

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('pdf'))
  async uploadPDF(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    if (!file) {
      throw new BadRequestException('PDF file is required');
    }

    const filters = {
      buyerName: body.buyerName,
      sellerName: body.sellerName,
      houseNumber: body.houseNumber,
      surveyNumber: body.surveyNumber,
      documentNumber: body.documentNumber,
    };

    let results = await this.transactionsService.processUpload(file, filters);

    results = await this.transactionsService.searchTransactions(filters);

    return {
      success: true,
      count: results.length,
      transactions: results,
    };
  }

  @Get('search')
  async searchTransactions(
    @Query() query: SearchTransactionsQueryDto,
  ) {
    const { buyerName, sellerName, houseNumber, surveyNumber, documentNumber } = query;

    const filters = {
      buyerName,
      sellerName,
      houseNumber,
      surveyNumber,
      documentNumber,
    };

    let results = await this.transactionsService.searchTransactions(filters);

    return {
      success: true,
      count: results.length,
      transactions: results,
    };
  }
}