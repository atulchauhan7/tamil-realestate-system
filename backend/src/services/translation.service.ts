import { Injectable } from '@nestjs/common';
import { Translate } from '@google-cloud/translate/build/src/v2';

@Injectable()
export class TranslationService {
  private translate: Translate;

  constructor() {
    // Initialize Google Translate API
    // Set GOOGLE_APPLICATION_CREDENTIALS env variable
    this.translate = new Translate({
      key: process.env.GOOGLE_TRANSLATE_API_KEY,
    });
  }

  async translateToEnglish(tamilText: string): Promise<string> {
    try {
      const [translation] = await this.translate.translate(tamilText, 'en');
      return translation;
    } catch (error) {
      console.error('Translation error:', error);
      return tamilText; // Return original if translation fails
    }
  }

  async translateBatch(tamilTexts: string[]): Promise<string[]> {
    try {
      const [translations] = await this.translate.translate(tamilTexts, 'en');
      return Array.isArray(translations) ? translations : [translations];
    } catch (error) {
      console.error('Batch translation error:', error);
      return tamilTexts; // Return originals if translation fails
    }
  }
}