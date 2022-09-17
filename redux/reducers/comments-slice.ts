import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

const initialState: IComment[] = [
    {
        _id: '1234567890',
        postId: '1234567890',
        avatar: '/images/avatar2.jpg',
        level: 1,
        name: {
            firstName: 'Nguyen',
            lastName: 'Thang',
        },
        content: 'Oh, verfy beautiful. haha.',
        image: 'https://res.cloudinary.com/cake-shop/image/upload/v1662601774/avatar1_hysxkd.jpg',
        parentComment: null,
        commentsChildren: 1,
        reaction: [
            {
                title: 'like',
                userId: '1234',
            },
            {
                title: 'haha',
                userId: '1234',
            },
            {
                title: 'love',
                userId: '1234',
            },
        ],
        createAt: '2022-09-10T03:24:00',
    },
    {
        _id: '1234567891',
        postId: '1234567890',
        avatar: '/images/avatar.jpg',
        level: 1,
        name: {
            firstName: 'Kim',
            lastName: 'Tuyen',
        },
        content: 'Oh, verfy beautiful. haha. Oh, verfy beautiful. haha. Oh, verfy beautiful. haha.',
        image: '',
        parentComment: null,
        commentsChildren: 1,
        reaction: [
            {
                title: 'like',
                userId: '123456',
            },
        ],
        createAt: '2022-09-10T03:24:00',
    },
    {
        _id: '1234567892',
        postId: '1234567890',
        avatar: '/images/avatar.jpg',
        level: 2,
        name: {
            firstName: 'Ha',
            lastName: 'Tuyen',
        },
        content: 'Wow wow.',
        image: '',
        parentComment: '1234567890',
        commentsChildren: 1,
        reaction: [
            {
                title: 'like',
                userId: '123456',
            },
        ],
        createAt: '2022-09-10T03:24:00',
    },
    {
        _id: '1234567893',
        postId: '1234567890',
        avatar: '/images/avatar.jpg',
        level: 3,
        name: {
            firstName: 'Ha',
            lastName: 'Tuyen',
        },
        content: 'haha haha.',
        image: '',
        parentComment: '1234567892',
        commentsChildren: 0,
        reaction: [
            {
                title: 'like',
                userId: '123456',
            },
        ],
        createAt: '2022-09-10T03:24:00',
    },
];

export const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {},
});

export const selectComments = (state: RootState) => state.comments;

export default commentsSlice.reducer;
