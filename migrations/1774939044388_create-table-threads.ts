/* eslint-disable camelcase */
import { MigrationBuilder } from 'node-pg-migrate';

export const up = (pgm: MigrationBuilder): void => {
  pgm.createTable('threads', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    body: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
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
  pgm.dropTable('threads');
};
