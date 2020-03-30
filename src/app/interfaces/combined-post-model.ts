export interface CombinedPostModel {
    authorID: string;
    postID?: string;
    date: any;
    permission: boolean;
    postDescription?: string;
    postImage?: string;
    postThumbnail?: string;
    privacy: string;
    type: string;
    author: {
        displayName: string;
        email: string;
        photoURL: string;
        uid: string;
    };
}
