import { Like } from "./like.model";
import { User } from "./user.model";

export class Post {
    id!: number;
    User!: User;
    Comments!: [Comment];
    Likes!: [Like];
    title!: string;
    content!: string;
    attachment!: string;
    isActive!: boolean;
    isSignaled!: boolean;
    points!: number;
    createdAt!: Date;
    updatedAt!: Date;
}