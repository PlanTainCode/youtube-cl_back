import { ModelType } from '@typegoose/typegoose/lib/types';
import { UserModel } from './../user/user.model';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from 'nestjs-typegoose';
import { AuthDto } from './auth.dto';
import { compare, genSalt, hash } from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
     private readonly jwtService: JwtService
     ) {}

    // Логин

    async login(dto: AuthDto) {
        const user = await this.validateUser(dto)

        return {
            user: this.returnUserFields(user),
            accessToken: await this.issueAccessToken(String(user._id))
        }
    }
    
    // Регистрация

    async register(dto: AuthDto) {
        const oldUser = await this.UserModel.findOne({email:dto.email})
        if (oldUser) throw new BadRequestException('Пользователь с этим email уже есть в системе')

        const salt = await genSalt(10)

        const newUser = new this.UserModel({
            email: dto.email,
            password: await hash(dto.password, salt)
        })

        const user = await newUser.save()

        return {
            user: this.returnUserFields(user),
            accessToken: await this.issueAccessToken(String(user._id))
        }
    }
    
    // Валидация
    
    async validateUser(dto: AuthDto):Promise<UserModel> {
        const user = await this.UserModel.findOne({email:dto.email})

        if (!user) throw new UnauthorizedException('Пользователь не найден ')
        
        const isValidPassword = await compare(dto.password, user.password)

        if (!isValidPassword) throw new UnauthorizedException('Неправильный пароль')

        return user
    }

    // Создание аксес токена

    async issueAccessToken(userId: string) {
        const data = {
            _id: userId
        }

        const accessToken = await this.jwtService.signAsync(data,{
            expiresIn: '30d'
        })

        return {accessToken}
    }

    // Возвращение юзера

    returnUserFields(user: UserModel) {
        return {
            _id: user._id,
            email: user.email,

        }
    }
}
