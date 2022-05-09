import { ComLike } from "./comLike.model";
import { Post } from "./post.model";
import { User } from "./user.model";

export class Comment {
    id!: number;
    User!: User;
    Post!: Post;
    ComLikes!: [ComLike];
    content!: string;
    attachment!: string;
}