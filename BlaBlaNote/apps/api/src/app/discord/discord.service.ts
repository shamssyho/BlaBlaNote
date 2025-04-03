import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class DiscordService {
  async sendWebhook(payload: {
    username: string;
    email: string;
    action: string;
    date: string;
  }) {
    const webhookUrl = process.env['DISCORD_WEBHOOK_URL'];
    if (!webhookUrl) {
      throw new Error('Missing Discord Webhook URL');
    }

    const embed = {
      title: '📢 Nouvelle action utilisateur',
      color: 0x5865f2,
      fields: [
        {
          name: '👤 Utilisateur',
          value: payload.username,
          inline: true,
        },
        {
          name: '📧 Email',
          value: payload.email,
          inline: true,
        },
        {
          name: '📌 Action',
          value: payload.action,
          inline: true,
        },
        {
          name: '🗓️ Date',
          value: payload.date,
          inline: false,
        },
      ],
    };

    await axios.post(webhookUrl, {
      embeds: [embed],
    });
  }
}
