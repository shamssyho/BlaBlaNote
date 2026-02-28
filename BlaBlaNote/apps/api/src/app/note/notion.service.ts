import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class NotionService {
  async appendToPage(pageId: string, content: string) {
    await axios.patch(
      `https://api.notion.com/v1/blocks/${pageId}/children`,
      {
        children: [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content,
                  },
                },
              ],
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
          'Notion-Version': '2022-06-28',
        },
      }
    );
  }
}
