import React, { useEffect, useImperativeHandle } from 'react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoClose } from 'react-icons/io5';
import { useStore } from 'react-redux';
import { Input } from '../..';
import { RootState } from '../../../app/store';
import Avatar from '../../avatar/avatar';
import ImageContainer from '../../image/image-container';

interface Props {
    postId: string;
    inputName: string;
    isHidden?: boolean;
    hasCancel?: boolean;
    commentId?: string;
    handleCancel?: () => void;
}

export const NewComment = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
    const store = useStore();

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

    const handleNewComment = (values: any) => {
        console.log('values: ', values);
        console.log('postId: ', props.postId);
        console.log('comment ', getValues(props.inputName));
        console.log('image ', image?.file);
    };

    const handleEnter = (values: any) => {
        if (values.key === 'Enter' && refEnter.current) {
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
            <Avatar url="/images/avatar1.jpg" size="medium" />
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
