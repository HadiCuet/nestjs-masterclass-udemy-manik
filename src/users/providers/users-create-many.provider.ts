import {
  BadRequestException,
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from '../user.entity';
import { DataSource } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(
    private readonly dataSource: DataSource,
  ) {}

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    let newUsers: User[] = [];
    // Create query runner instance
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      // Connect Query Runner to datasource
      await queryRunner.connect();
      // Start transaction
      await queryRunner.startTransaction();
    } catch (error) {
      throw new RequestTimeoutException('Database request timed out', {
        description:
          'The request to start a transaction took too long to complete.',
      });
    }

    try {
      for (let user of createManyUsersDto.users) {
        let existingUser: User | null = null;
        try {
          existingUser = await queryRunner.manager.findOne(User, {
            where: { email: user.email },
          });
        } catch (error) {
          throw new RequestTimeoutException(
            'Database request timed out while checking for existing user',
          );
        }
        if (existingUser) {
          throw new BadRequestException(
            `User with email ${user.email} already exists`,
          );
        }

        let newUser = queryRunner.manager.create(User, user);
        try {
          let result = await queryRunner.manager.save(newUser);
          newUsers.push(result);
        } catch (error) {
          throw new RequestTimeoutException(
            'Database request timed out while creating a new user',
          );
        }
      }
      // If successfully create all users, commit transaction
      await queryRunner.commitTransaction();
    } catch (error) {
      // If any error occurs, rollback transaction
      await queryRunner.rollbackTransaction();
      throw new ConflictException(
        'Could not create all users, rollback occurred',
        {
          description: String(error),
        },
      );
    } finally {
      try {
        // Finally, release query runner / connection
        await queryRunner.release();
      } catch (error) {
        throw new RequestTimeoutException(
          'Could not release database connection',
          {
            description: String(error),
          },
        );
      }
    }
    return newUsers;
  }
}
