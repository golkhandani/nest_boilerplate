
import { BadRequestException, Injectable, HttpException } from '@nestjs/common';

import { User } from '../../shared/models/users.model';
import { UpdateUserDto } from './dtos';
import { UserInHeader } from '@shared/decorators';
import { fsRemoveFileIfExists } from '@shared/helpers';
import { NotificationService } from '@services/notification/notification.provider';
import { UserRepository } from './repositories/user.repository';
import { IMulterFile } from '@shared/interfaces';

@Injectable()
export class UsersProfileProvider {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly notificatonService: NotificationService,
    ) {

    }

    async initUser(userObj: Partial<User>): Promise<User> {
        const savedUser = await this.userRepository.create(userObj);
        await this.notificatonService.initNotificationPlayer(savedUser);
        return savedUser;
    }
    async findOne(query: any): Promise<User> {
        return await this.userRepository.findOne(query);
    }
    async upsertOne(upserObj: Partial<User>) {
        return this.userRepository.upsertOne(upserObj);
    }
    async findByUniquesForValidation(value: string): Promise<User> {
        return await this.userRepository.findByUniquesForValidation(value);
    }
    /**
     * internal function
     */
    public async getProfileByUserId(user_id: string): Promise<User> {
        return await this.userRepository.findOne({ user_id });
    }

    /**
     * get all users profile(just available to admin)
     */
    async getProfiles(limit: number, skip: number): Promise<User[]> {
        const options = {
            limit,
            skip,
        };
        return await this.userRepository.find({}, options);
    }
    /**
     * get user specific profile
     * @param user payload user from jwt contain _id
     */
    async getProfile(user: UserInHeader): Promise<User> {
        const eu = await this.userRepository.findOne({ user_id: user.user_id });
        return Object.assign(eu) as User;
    }
    async updateProfile(user: UserInHeader, updates: UpdateUserDto): Promise<User> {
        if (updates.name) {
            (updates as any).verified = true;
        }
        const eu = await this.userRepository
            .findOneAndUpdate(
                { user_id: user.user_id },
                updates,
            );
        return Object.assign(eu) as User;

    }
    /**
     * add profile picture to user
     * @param user payload user from jwt contain _id
     * @param file uploaded file from user
     */
    async updateProfilePicture(user: UserInHeader, file: IMulterFile): Promise<User> {
        if (!file) {
            throw new BadRequestException('select file');
        } else {
            const pictureUpdate = {
                picture: {
                    suffix: file.path,
                },
            };
            const eu = await this.userRepository.findOneAndUpdate(
                { user_id: user.user_id },
                pictureUpdate,
            );
            return eu;
        }
    }

    async deleteProfilePicture(user: UserInHeader): Promise<User> {
        const pictureUpdate = {
            picture: { prefix: null, suffix: '' },
        };
        const eu = await this.userRepository.findOneAndUpdate(
            { user_id: user.user_id },
            pictureUpdate,
            { new: false },
        );
        if (eu?.picture?.suffix) {
            await fsRemoveFileIfExists(eu.picture.suffix);
        }
        eu.picture = undefined;
        return eu;
    }

    async transactionTest() {

        // const session = await this.UserModel.db.startSession();
        // session.startTransaction();
        // let userTest: any = {};
        // try {
        //     userTest = await this.UserModel.findOneAndUpdate({
        //         name: 'Transaction 12',
        //     }, {
        //         name: 'Transaction 12',
        //     }, { upsert: true, new: true })
        //         .session(session)
        //         .exec();
        //     throw new Error('transaction error');
        //     await session.commitTransaction();
        // } catch (error) {
        //     await session.abortTransaction();
        //     throw new BadRequestException();
        // } finally {
        //     console.log('transaction finished');
        //     session.endSession();
        // }
        return {};
    }

}
