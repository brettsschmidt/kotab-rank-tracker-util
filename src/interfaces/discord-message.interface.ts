export interface DiscordEmbed {
  title?: string;
  description?: string;
  fields: Array<DiscordEmbedField>
}

export interface DiscordEmbedField {
  name: string;
  value: string;
  inline: boolean;
}

export interface DiscordMessage {
  content?: string,

  // Not actually required. Keeping it this way currently because this is only for us
  embeds: Array<DiscordEmbed>
}