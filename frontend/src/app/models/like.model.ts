import { Post } from "./post.model";
import { User } from "./user.model";

export class Like {
    id!: number;
    User!: User;
    Post!: Post;
    userId!: number;
    postId!: number;
    isLiked!: boolean;
}