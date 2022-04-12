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

export class User {
    id!: number;
    Posts!: [Post];
    email!: string;
    username!: string;
    password!: string;
    bio!: string;
    avatar!: string;
    isAdmin!: boolean;
    createdAt!: Date;
    updatedAt!: Date;
}

export class Comment {
    id!: number;
    User!: User;
    Post!: Post;
    ComLikes!: [ComLike];
    content!: string;
    attachment!: string;
}

export class Like {
    id!: number;
    User!: User;
    Post!: Post;
    userId!: number;
    postId!: number;
    isLiked!: boolean;
}

export class ComLike {
    id!: number;
    User!: User;
    Comment!: Comment;
    userId!: number;
    commentId!: number;
    isLiked!: boolean;
}