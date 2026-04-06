import type { CreateThreadDto } from '@/applications/dtos/index.js';

import {
  Thread,
  ThreadBody,
  type ThreadRepository,
  ThreadTitle,
  UserId,
  type UserRepository,
} from '@/domains/index.js';

export class CreateThreadUseCase {
  private readonly threadRepository: ThreadRepository;
  private readonly userRepository: UserRepository;

  constructor({
    threadRepository,
    userRepository,
  }: {
    threadRepository: ThreadRepository;
    userRepository: UserRepository;
  }) {
    this.userRepository = userRepository;
    this.threadRepository = threadRepository;
  }

  async execute(
    createThreadDto: CreateThreadDto,
  ): Promise<{ id: string; title: string; owner: string }> {
    const { title, body, owner } = this.validateDto(createThreadDto);
    await this.userRepository.findById(owner);

    const thread = Thread.create({
      title: title.value,
      body: body.value,
      owner: owner.value,
    });

    const savedThread = await this.threadRepository.save(thread);

    return {
      id: savedThread.id.value,
      title: savedThread.title.value,
      owner: savedThread.owner.value,
    };
  }

  private validateDto(createThreadDto: CreateThreadDto): {
    title: ThreadTitle;
    body: ThreadBody;
    owner: UserId;
  } {
    return {
      title: ThreadTitle.create(createThreadDto.title),
      body: ThreadBody.create(createThreadDto.body),
      owner: UserId.create(createThreadDto.owner),
    };
  }
}
