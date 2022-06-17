import { CommentModel } from './../comment/comment.model';
import { prop, Ref } from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";


export interface VideoModel extends Base {}



export class VideoModel extends TimeStamps {

    @prop()
    name: string

    @prop()
    isPublic : boolean

    @prop({default: 0})
    views?: number

    @prop({default: 0})
    likes?: number

    @prop({default: 0})
    dislikes?: number

    @prop()
    description: string

    @prop()
    videoPath: string

    @prop()
    posterPath: string
}
