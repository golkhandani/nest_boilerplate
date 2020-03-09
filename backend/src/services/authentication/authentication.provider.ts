import * as base64 from 'base-64';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import * as moment from 'moment';
import * as jwt from 'jsonwebtoken';
import {
    ForbiddenException,
    HttpException, Injectable,
    NotFoundException,
    BadRequestException,
    HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// dtos
import {
    SignupByUsernameDto, UserWithTokenDto, VerificationCodeDto, SignupByEmailDto,
} from '@services/authentication/dtos';
// helpers
import { Google, PhoneVerfication, TokenSubject } from '@services/authentication/helpers';
// shared constants
import { bcryptConstants, jwtLockConstants, jwtUnlockConstants, phoneConstants, keyConstants } from '@constants/index';
// shared enums
import { OS } from '@shared/enums';
// shared models
import { UserRoles, User } from '@shared/models';
import { WsException } from '@nestjs/websockets';
import { AuthorizationProvider } from '@services/authorization/authorization.provider';
import { UserScopes } from '@services/authorization/models';
import { NotificationService } from '@services/notification/notification.provider';
import { UsersProfileProvider } from '@services/profiles/profiles.provider';
import { NotificationTemplate } from '@services/notification/enums/notificationTemplate.enum';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { PhoneVerificationRepository } from './repositories/phone-verification.repository';

@Injectable()
export class AuthenticationProvider {
    constructor(
        private readonly phoneVerificationRepository: PhoneVerificationRepository,
        private readonly refreshTokenRepository: RefreshTokenRepository,
        private readonly userService: UsersProfileProvider,
        private readonly jwtService: JwtService,
        private readonly authorizationProvider: AuthorizationProvider,
        private readonly notificationService: NotificationService,
    ) { }

    async findByUniquesForValidation(value: string): Promise<User> {
        return await this.userService.findByUniquesForValidation(value);
    }
    private async createRefreshToken(safeUser: User): Promise<string> {
        await this.refreshTokenRepository.findOneAndRemove({ user: safeUser.user_id });
        const expires = moment().add(jwtLockConstants.expirationInterval, 'days').toDate();
        const token = base64.encode(Math.random() + safeUser.user_id + Math.random());
        const newRefreshToken = await this.refreshTokenRepository.create({
            token,
            user_id: safeUser.user_id,
            expires,
        });
        return token;
    }

    /**
     * Validates the token
     *
     * @param {string} token - The JWT token to validate
     * @param {boolean} isWs - True to handle WS exception instead of HTTP exception (default: false)
     */
    async verify(token: string, isWs: boolean = false): Promise<User | null> {
        try {
            if (!token) { throw new WsException('Unauthorized access'); }
            const payload = this.jwtService.verify(token, {
                algorithms: [jwtLockConstants.algorithm],
            });
            const user = await this.userService.findOne({ user_id: payload.user_id });

            if (!user) {
                if (isWs) {
                    throw new WsException('Unauthorized access');
                } else {
                    throw new HttpException(
                        'Unauthorized access',
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }

            return user;
        } catch (err) {
            if (isWs) {
                throw new WsException(err.message);
            } else {
                throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
            }
        }
    }
    private createAccessToken(payload: User): string {
        return this.jwtService.sign(payload, {
            subject: TokenSubject.lock(payload),
            algorithm: jwtLockConstants.algorithm,
            issuer: jwtLockConstants.issuer,
            audience: jwtLockConstants.audience,
            expiresIn: jwtLockConstants.expiresIn,
        });
    }
    private async createTokenResponse(userObj: User): Promise<UserWithTokenDto> {
        const user = {
            user_id: userObj.user_id,
            role: userObj.role || UserRoles.GUEST,
        } as User;
        const payload = user;
        const accessToken = this.createAccessToken(payload);
        const refreshToken = await this.createRefreshToken(user);
        const tokenType = 'Bearer';
        return { user: userObj, oAuth2: { tokenType, refreshToken, accessToken } };
    }
    private async validatedUser(userObj: User, password: string) {

        if (!userObj) {
            throw new HttpException('user not found', 404);
        } else if (!password || !compareSync(password, userObj.password)) {
            throw new HttpException('invalid password', 400);
        } else {
            return await this.createTokenResponse(userObj);
        }
    }
    public async refreshAccessToken(oldRefreshToken: string): Promise<UserWithTokenDto> {
        const refreshTokenObj = await this.refreshTokenRepository.findOne({ token: oldRefreshToken });
        if (!refreshTokenObj) {
            throw new ForbiddenException();
        }
        const userObj: User = await this.userService.findOne({ user_id: refreshTokenObj.user_id }) as User;
        if (!userObj) {
            throw new HttpException('invalid token', 400);
        }
        return await this.createTokenResponse(userObj);
    }
    private generatedHashPassword(password: string): string {
        const salt = genSaltSync(bcryptConstants.saltRounds);
        const hashed = hashSync(password, salt);
        return hashed;
    }
    //#region SIGN UP/IN
    public async signAsGuest(headers: any): Promise<UserWithTokenDto> {
        // TODO : change the way you get real fingerprint
        const fingerprint: string = headers.fingerprint || base64.encode(JSON.stringify(headers));
        const existsUser: User = await this.userService.findOne({ fingerprint });
        if (!existsUser) {
            const userObj = {
                fingerprint,
                role: UserRoles.GUEST,
            };
            const savedUser = await this.userService.initUser(userObj);
            await this.authorizationProvider.initScopes(savedUser.user_id, [UserScopes.READ]);

            return await this.createTokenResponse(savedUser);
        } else {
            return await this.createTokenResponse(existsUser);
        }
    }

    public async signupByUserPass(userObj: SignupByUsernameDto): Promise<UserWithTokenDto> {
        userObj.password = this.generatedHashPassword(userObj.password);
        const savedUser = await this.userService.initUser(userObj);
        await this.authorizationProvider.initScopes(savedUser.user_id, [UserScopes.ME, UserScopes.READ]);

        return await this.createTokenResponse(savedUser);
    }
    public async signinByUserPass(username: string, password: string): Promise<UserWithTokenDto> {
        const userObj: User = await this.userService.findOne({ username }) as User;
        return await this.validatedUser(userObj, password);
    }

    private generalTokenEncode(obj: any) {
        const encrypted = jwt.sign(
            obj,
            keyConstants.general_key,
            {
                algorithm: 'HS256',
            });
        return encrypted;
    }
    private generalTokenDecode(str: string, objName: string) {
        try {
            const decoded = jwt.verify(str, keyConstants.general_key);
            return decoded[objName];
        } catch {
            throw new BadRequestException('invalid token');
        }

    }
    private sendVerificationEmail(token: string) {
        // send email
        console.log('MAIL SENT WITH TOKEN : ', token);
    }
    public async signupByEmailPass(userObj: SignupByEmailDto): Promise<UserWithTokenDto> {
        (userObj as any).password = this.generatedHashPassword(userObj.password);
        const savedUser = await this.userService.initUser(userObj);
        await this.authorizationProvider.initScopes(savedUser.user_id, [UserScopes.ME, UserScopes.READ]);

        // send verification mail
        const token = this.generalTokenEncode({ email: userObj.email });
        await this.sendVerificationEmail(token);
        return await this.createTokenResponse(savedUser);
    }
    public async signinByEmailPass(email: string, password: string): Promise<UserWithTokenDto> {
        const userObj: User = await this.userService.findOne({ email }) as User;
        return await this.validatedUser(userObj, password);
    }
    public async verifyByEmail(token: string): Promise<boolean> {
        const email = this.generalTokenDecode(token, 'email');
        if (!email) {
            throw new NotFoundException('token not found');
        } else {
            const userObj: User = await this.userService.upsertOne(
                { email }) as User;
            return userObj ? true : false;
        }
    }
    public async resendVerificationByEmail(email: string, password: string): Promise<boolean> {
        const userObj: User = await this.userService.findOne({ email }) as User;
        const userWithToken = await this.validatedUser(userObj, password);
        if (userWithToken) {
            const token = this.generalTokenEncode({ email: userObj.email });
            await this.sendVerificationEmail(token);
            return true;
        } else {
            throw new BadRequestException('invalid user');
        }
    }

    private humanDateDiff(t1: Date, t2: Date) {

        const diff = Math.max(t1.valueOf(), t2.valueOf()) - Math.min(t1.valueOf(), t2.valueOf());
        const SECOND = 1000;
        const MINUTE = 60 * SECOND;
        const HOURS = 60 * MINUTE;

        const hrs = Math.floor(diff / HOURS);
        const min = Math.floor((diff % HOURS) / MINUTE).toLocaleString('en-US', { minimumIntegerDigits: 2 });
        const sec = Math.floor((diff % MINUTE) / SECOND).toLocaleString('en-US', { minimumIntegerDigits: 2 });
        const ms = Math.floor(diff % SECOND).toLocaleString('en-US', { minimumIntegerDigits: 4, useGrouping: false });

        return `${hrs}:${min}:${sec}.${ms}`;
    }
    private secondDateDiff(t1: Date, t2: Date) {

        const diff = Math.max(t1.valueOf(), t2.valueOf()) - Math.min(t1.valueOf(), t2.valueOf());
        const SECOND = 1000;
        const MINUTE = 60 * SECOND;
        const HOURS = 60 * MINUTE;

        const sec = Math.floor(diff / SECOND);
        return sec;
    }
    /**
     * calculate cooldown items
     * @param startDate lastTryTime
     * @param endDate nextTryTime
     */
    private calculateCooldownTimes(startDate: Date, endDate: Date) {
        const cooldownDuration = this.secondDateDiff(startDate, endDate);
        const cooldownProgress = this.secondDateDiff(endDate, new Date());
        return { cooldownDuration, cooldownProgress };
    }
    /**
     * Step 1 / 4
     * get phone number and create verfication code
     * we will use verfication code to complete signup
     * @param phone string
     */
    public async signinByPhoneNumber(phone: string): Promise<VerificationCodeDto> {
        const exists = await this.phoneVerificationRepository.findOne({ phone });

        if (!exists) {
            const { code, codeLength, codeType } = PhoneVerfication.randomCode;
            const expires = moment().add(phoneConstants.expirationInterval, 'minutes').toDate();
            const nextTryTime = moment().add(Math.pow(phoneConstants.nextTryTimeInterval, 0), 'minutes').toDate();
            const lastTryTime = moment().toDate();
            const { cooldownDuration, cooldownProgress } = this.calculateCooldownTimes(lastTryTime, nextTryTime);
            const newVerification = await this.phoneVerificationRepository.create({
                phone,
                code,
                codeType,
                codeLength,
                expires,
                nextTryTime,
                lastTryTime,

            });
            this.notificationService.sendMessageToSinglePhone(
                phone,
                [code],
                NotificationTemplate.LOGIN,
            );
            return {
                codeType,
                codeLength,
                expires,
                cooldownDuration,
                cooldownProgress,
            } as any;
        } else if (exists.ban) {
            throw new HttpException('you are ban', 403);
        } else if (moment(exists.nextTryTime).isAfter(Date.now()) && exists.failedCountCode >= 5) {
            throw new HttpException('your code is expired try to send phone number again', 429);
        } else if (moment(exists.nextTryTime).isAfter(Date.now())) {
            const { cooldownDuration, cooldownProgress } = this.calculateCooldownTimes(exists.lastTryTime, exists.nextTryTime);
            return {
                codeType: exists.codeType,
                codeLength: exists.codeLength,
                expires: exists.expires,
                cooldownDuration,
                cooldownProgress,
            } as any;
            throw new HttpException('your code is already reported', 208);
        } else if (!exists.code || moment(exists.nextTryTime).isBefore(Date.now())) {
            const { code, codeLength, codeType } = PhoneVerfication.randomCode;
            const expires = moment().add(phoneConstants.expirationInterval, 'minutes').toDate();
            const nextTryTime = moment().add(Math.pow(phoneConstants.nextTryTimeInterval, exists.failedCountTotal), 'minutes').toDate();
            const lastTryTime = moment().toDate();

            const update = {
                code,
                codeLength,
                codeType,
                expires,
                nextTryTime,
                lastTryTime,
                failedCountCode: 0,
                failedCountTotal: exists.failedCountTotal + 1,

            };
            const updated = await this.phoneVerificationRepository.findOneAndUpdate({ phone }, update, { new: true });
            const { cooldownDuration, cooldownProgress } = this.calculateCooldownTimes(updated.lastTryTime, updated.nextTryTime);
            this.notificationService.sendMessageToSinglePhone(
                phone,
                [code],
                NotificationTemplate.LOGIN,
            );
            return {
                codeType,
                codeLength,
                expires,
                cooldownDuration,
                cooldownProgress,
            } as any;

        }

    }
    public async signinByPhoneCode(phone: string, code: string): Promise<UserWithTokenDto> {
        const phoneVerfication = await this.phoneVerificationRepository.findOne({ phone });
        if (!phoneVerfication) { throw new HttpException('your code is expired try to send phone number again', 401); }

        if (moment(phoneVerfication.expires).isBefore(Date.now())) {
            throw new HttpException('your code is expired try to send phone number again', 401);
        } else if (phoneVerfication.code === code) {
            await this.phoneVerificationRepository.findOneAndRemove({ phone });
            const existsUser = await this.userService.findOne({ phone });
            if (existsUser) {
                return await this.createTokenResponse(existsUser);
            } else {
                const savedUser = await this.userService.initUser({ phone });
                await this.authorizationProvider.initScopes(savedUser.user_id, [UserScopes.ME, UserScopes.READ]);

                return await this.createTokenResponse(savedUser);
            }
        } else {
            if (phoneVerfication.code === null) { throw new HttpException('your code is expired try to send phone number again', 401); }
            if (phoneVerfication.failedCountTotal > 5) {
                const update = {
                    ban: true,
                };
                await this.phoneVerificationRepository.findOneAndUpdate({ phone }, update);
                throw new HttpException('your code is expired try to send phone number again', 401);
            } else if (phoneVerfication.failedCountCode >= 5) {
                const update = {
                    code: null,
                };
                await this.phoneVerificationRepository.findOneAndUpdate({ phone }, update);
                throw new HttpException('your code is expired try to send phone number again', 401);
            } else if (phoneVerfication.failedCountCode < 5) {
                const update = {
                    failedCountCode: phoneVerfication.failedCountCode + 1,
                };
                await this.phoneVerificationRepository.findOneAndUpdate({ phone }, update);
                throw new HttpException('invalid code', 400);
            }
            throw new HttpException('invalid code', 400);
        }
    }
    public async signinByGoogle(
        googleAccessToken: string,
        os: OS,
    ): Promise<UserWithTokenDto> {

        const google = new Google(os, googleAccessToken);
        const googleUser = await google.getUserInfo();

        // google account is found Or not so
        if (googleUser) {
            const existsUser = await this.userService.findOne({
                $or: [
                    { google: googleUser.google },
                    { gmail: googleUser.google },
                ],
            }) as User;
            /**
             * if existsUser is null
             * we should create new user
             * if userWithGoogle or userWithGmail return true
             * we just have to update record
             */

            const userWithGoogle = existsUser && existsUser.google === googleUser.google;
            const userWithVerifiedGmail = existsUser && existsUser.email === googleUser.google && existsUser.verified;

            if (!existsUser) {
                const savedUser = await this.userService.initUser(googleUser);
                await this.authorizationProvider.initScopes(savedUser.user_id, [UserScopes.ME, UserScopes.READ]);

                return await this.createTokenResponse(savedUser);

            } else if (userWithGoogle) {
                return await this.createTokenResponse(existsUser);
            } else if (userWithVerifiedGmail) {
                return await this.createTokenResponse(existsUser);
            } else {
                throw new HttpException(`
                gmail already exist but not verified plz verify it first
                if its not yours contanct support`
                    , 400);
            }

        } else {
            throw new HttpException('google user not found', 404);
        }

    }
}
