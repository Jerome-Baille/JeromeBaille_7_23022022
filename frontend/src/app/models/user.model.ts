import { Post } from "./post.model";

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