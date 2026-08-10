import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const driveFiles = pgTable('drive_files', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  fileId: text('file_id').notNull(),
  name: text('name').notNull(),
  mimeType: text('mime_type'),
  webViewLink: text('web_view_link'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  driveFiles: many(driveFiles),
}));

export const driveFilesRelations = relations(driveFiles, ({ one }) => ({
  user: one(users, {
    fields: [driveFiles.userId],
    references: [users.id],
  }),
}));
