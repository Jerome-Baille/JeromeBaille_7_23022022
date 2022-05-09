import { User } from "./user.model";

export class ComLike {
    id!: number;
    User!: User;
    Comment!: Comment;
    userId!: number;
    commentId!: number;
    isLiked!: boolean;
}