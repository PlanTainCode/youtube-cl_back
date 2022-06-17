import { ConfigService } from '@nestjs/config';
import { TypegooseModuleOptions } from 'nestjs-typegoose';

export const getMongoConfig = async (ConfigService: ConfigService):Promise<TypegooseModuleOptions> => ({
    uri: ConfigService.get('MONGO_URI')
})