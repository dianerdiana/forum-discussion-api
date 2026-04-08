/* eslint-disable camelcase */
import { MigrationBuilder } from 'node-pg-migrate';

export const up = (pgm: MigrationBuilder): void => {
  pgm.createTable('comment_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      references: 'threads',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    comment_id: {
      type: 'VARCHAR(50)',
      references: 'comments',
      onUpdate: 'CASCADE',
    },
    user_id: {
      type: 'VARCHAR(50)',
      references: 'users',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('now()'),
    },
  });
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.dropTable('comment_likes');
};
