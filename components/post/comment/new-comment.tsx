import React, { useEffect, useImperativeHandle } from 'react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoClose } from 'react-icons/io5';
import { useStore } from 'react-redux';
import { Input } from '../..';
import { RootState } from '../../../app/store';
import { useAppDispatch, useAppSelector } from '../../../hook/redux';
import { createComments, editComments } from '../../../redux/actions/comment-action';
import { selectUser } from '../../../redux/reducers/user-slice';
import Avatar from '../../avatar/avatar';
import ImageContainer from '../../image/image-container';

export interface ISuccess {
    id?: string;
    parentId?: string;
    postId?: string;
}

interface Props {
    postId: string;
    inputName: string;
    postPersonId: string;
    isHidden?: boolean;
    hasCancel?: boolean;
    parentId?: string;
    commentId?: string;
    handleSuccess?: (data?: ISuccess) => void;
    handleCancel?: () => void;
}

export const NewComment = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
    const store = useStore();
    const dispatch = useAppDispatch();

    const sUser = useAppSelector(selectUser).data;
    const refEnter = useRef<HTMLButtonElement>(null);
    const refContainer = useRef<HTMLDivElement | null>(null);

    useImperativeHandle(ref, () => refContainer.current as HTMLDivElement);

    const [image, setImage] = useState<IImageStore>();

    const {
        register,
        getValues,
        resetField,
        setValue,
        formState: { errors },
        handleSubmit,
    } = useForm({
        defaultValues: {
            [props.inputName]: '',
        },
    });

    const handleNewComment = async (values: any) => {
        console.log('values: ', values);
        console.log('postId: ', props.postId);
        console.log('comment ', getValues(props.inputName));
        console.log('image ', image?.file);

        if ('commentEdit' in values) {
            const formdata = new FormData();
            formdata.append('id', props.commentId || '');
            formdata.append('content', values[props.inputName]);
            if (image?.file) {
                formdata.append('image', image?.file);
            }
            if (image?.url) {
                formdata.append('oldImage', image?.url);
            }

            await dispatch(editComments(formdata));

            if (props.handleSuccess) {
                props.handleSuccess();
            }
            handleCancelWriteComment();
        }

        if ('commentReply' in values) {
            const formData = new FormData();
            formData.append('postId', props.postId);
            formData.append('postPersonId', props.postPersonId);
            formData.append('content', values[props.inputName]);

            if (image?.file) {
                formData.append('image', image.file);
            }

            if (props.parentId) {
                console.log('props.parentId: ', props.parentId);
                formData.append('parentId', props.parentId);
            }

            const response = (await dispatch(createComments(formData))).payload as ICreateCommentResponse;

            if (props.handleSuccess) {
                props.handleSuccess({ id: response.after, parentId: props.parentId, postId: props.postId });
            }
            if (props.isHidden) {
                handleCancelWriteComment();
            }
            resetField(props.inputName);
            setImage(undefined);
        }
    };

    const handleEnter = () => {
        if (refEnter.current) {
            refEnter.current.click();
        }
    };

    const handleImagechange = (data: IImageStore) => {
        setImage(data);
    };

    const handleDeleteImageComment = () => {
        setImage(undefined);
    };

    const handleCancelWriteComment = () => {
        resetField(props.inputName);
        setImage(undefined);
        if (refContainer.current) {
            refContainer.current.classList.add('hidden');
        }
        if (props.handleCancel) {
            props.handleCancel();
            console.log('da chay');
        }
    };

    useEffect(() => {
        if (props.commentId) {
            const state = store.getState() as RootState;
            const comment = state.comments.find((item) => item._id === props.commentId);
            if (comment) {
                setValue(props.inputName, comment?.content);
                setImage({
                    id: '123123',
                    url: comment.image,
                });
            }
        }
    }, []);

    return (
        <div ref={refContainer} className={`flex gap-x-3 ${props.isHidden && 'hidden'}`}>
            <Avatar url={sUser?.avatar || ''} size="medium" />
            <div className="w-full space-y-3">
                <form onSubmit={handleSubmit(handleNewComment)}>
                    <Input
                        isHasEmojiIcon={true}
                        isHasPhotoIcon={image?.url ? false : true}
                        register={register}
                        placeholder={'Write a comment...'}
                        type={'text'}
                        name={props.inputName}
                        onKeyPress={handleEnter}
                        onChangeImage={handleImagechange}
                        isTextArea={true}
                        options={{
                            validate: () => (getValues(props.inputName) || image ? true : 'Must have comment or image'),
                        }}
                        border={false}
                        errors={errors[props.inputName]?.message}
                        background={true}
                    />
                    <button ref={refEnter} type="submit" className="hidden">
                        send
                    </button>
                </form>
                {image?.url && (
                    <div className="w-full">
                        <div className="relative w-56">
                            <button
                                onClick={handleDeleteImageComment}
                                className="absolute z-10 p-2 bg-white rounded-full top-2 right-2"
                            >
                                <IoClose size={14} />
                            </button>
                            <ImageContainer url={image.url} quantity="single" />
                        </div>
                    </div>
                )}
                {props.hasCancel && (
                    <button className="text-blue-400 underline" onClick={handleCancelWriteComment}>
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
});

NewComment.displayName = 'NewComment';
