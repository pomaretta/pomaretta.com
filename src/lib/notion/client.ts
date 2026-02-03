import { Client } from '@notionhq/client'

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

export const BLOG_DATABASE_ID = process.env.NOTION_BLOG_DATABASE_ID || ''
