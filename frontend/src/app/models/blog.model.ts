export class FaceSnap {
    id!: number;
    User!: User;
    title!: string;
    content!: string;
    attachment!: string;
    isActive!: boolean;
    createdAt!: Date;
    updatedAt!: Date;
    likes!: number;
    location?: string;
}

export class User {
    id!: number;
    email!: string;
    username!: string;
    password!: string;
    bio!: string;
    isAdmin!: boolean;
    createdAt!: Date;
    updatedAt!: Date;
}