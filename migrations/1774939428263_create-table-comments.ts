import { MigrationBuilder } from 'node-pg-migrate';

export const up = (pgm: MigrationBuilder): void => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    threadId: {
      type: 'VARCHAR(50)',
      references: 'threads',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    parentId: {
      type: 'VARCHAR(50)',
      references: 'comments',
      onUpdate: 'CASCADE',
    },
    owner: {
      type: 'VARCHAR(50)',
      references: 'users',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    content: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('now()'),
    },
    deletedAt: {
      type: 'timestamp',
    },
  });
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.dropTable('comments');
};
