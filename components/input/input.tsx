import { useEffect, useRef } from 'react';
import { RegisterOptions, UseFormRegister } from 'react-hook-form';
import { TiWarning } from 'react-icons/ti';
import dynamic from 'next/dynamic';
import { RiUserSmileLine } from 'react-icons/ri';
import { BsImage } from 'react-icons/bs';
import { IEmojiData } from 'emoji-picker-react';
const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });
import { useAppDispatch } from '../../hook/redux';

interface Props {
    icon?: JSX.Element | Array<JSX.Element>;
    placeholder: string;
    defaultValue?: string | number | undefined;
    type: 'text' | 'number' | 'password' | 'email';
    register: UseFormRegister<any>;
    options?: RegisterOptions;
    errors?: string;
    name: string;
    border?: boolean;
    background?: boolean;
    isTextArea?: boolean;
    isHasEmojiIcon?: boolean;
    isHasPhotoIcon?: boolean;
    commentId?: string;
    disabled?: boolean;
    isMultipleImages?: boolean;
    onKeyPress?: () => void;
    onChangeImage?: (data: IImageStore) => void;
    onChangeImages?: (data: IImageStore[]) => void;
}

export const Input = ({
    icon,
    placeholder,
    defaultValue,
    type,
    name,
    register,
    options,
    errors,
    border,
    background,
    isTextArea,
    isHasEmojiIcon,
    isHasPhotoIcon,
    commentId,
    disabled,
    isMultipleImages,
    onKeyPress,
    onChangeImage,
    onChangeImages,
}: Props) => {
    const refTextArea = useRef<HTMLTextAreaElement | null>(null);
    const refPickerEmoji = useRef<HTMLDivElement>(null);
    const refIconEmoji = useRef<HTMLDivElement>(null);
    const refInput = useRef<HTMLInputElement | null>(null);
    const refInputFile = useRef<HTMLInputElement>(null);
    const { ref, onChange } = register(name);

    const dispatch = useAppDispatch();

    const onEmojiClick = (event: any, emojiObject: IEmojiData) => {
        if (refTextArea.current && isTextArea) {
            refTextArea.current.value = refTextArea.current.value + emojiObject.emoji;
            console.log('refTextArea.current.value: ', refTextArea.current.value);
            onChange({
                target: refTextArea.current,
            });
            refTextArea.current.focus();
        } else if (refInput.current) {
            refInput.current.value = refInput.current.value + emojiObject.emoji;
            onChange({
                target: refInput.current,
            });
            refInput.current.focus();
        }
        autosize();
    };

    const handleShowPickerEmoji = () => {
        if (refPickerEmoji.current && !disabled) {
            refPickerEmoji.current.classList.remove('hidden');
        }
    };

    function autosize() {
        if (refTextArea.current) {
            refTextArea.current.style.height = 'auto';
            refTextArea.current.style.height = refTextArea.current.scrollHeight + 'px';
        }
    }

    const openInputFile = () => {
        if (refInputFile.current) {
            refInputFile.current.click();
        }
    };

    const handleInputFileChange = (event: any) => {
        if (isMultipleImages) {
            const data: IImageStore[] = [];
            for (const image of event.target.files) {
                const url = URL.createObjectURL(image);
                data.push({
                    id: Math.floor(Math.random() * 100000).toString(),
                    url,
                    file: image,
                });
            }
            if (onChangeImages) {
                onChangeImages(data);
            }
        } else {
            const file = event.target.files[0];
            const url = URL.createObjectURL(file);

            if (onChangeImage) {
                onChangeImage({
                    id: '1212',
                    url: url,
                    file: file,
                });
            }
        }
    };

    const handleOnPress = (values: any) => {
        if (values.key === 'Enter') {
            refTextArea.current?.blur();
            if (onKeyPress) onKeyPress();
        }
    };

    useEffect(() => {
        const handleClickOutsideBox = (event: MouseEvent) => {
            const { target } = event;

            if (refPickerEmoji.current && refIconEmoji.current && target && 'nodeType' in target) {
                if (!refIconEmoji.current.contains(target) && !refPickerEmoji.current.contains(target)) {
                    refPickerEmoji.current.classList.add('hidden');
                }
            }
        };

        document.addEventListener('click', handleClickOutsideBox);

        return () => {
            document.removeEventListener('click', handleClickOutsideBox);
        };
    });

    useEffect(() => {
        if (refTextArea.current) {
            refTextArea.current.addEventListener('input', autosize);
        }
    }, []);

    return (
        <>
            {/* remove h-full */}
            <div
                aria-disabled={disabled}
                className={`${border ? 'border' : ''} flex ${background ? 'bg-secondary-10' : 'bg-transparent'} ${
                    disabled && 'cursor-not-allowed'
                } px-[10px] gap-3 relative rounded-lg focus-within:border-secondary-30 `}
            >
                <div className="flex items-center ">{icon}</div>
                {!isTextArea ? (
                    <input
                        {...register(name, { ...options })}
                        type={type}
                        //ref={refInput}
                        ref={(e) => {
                            ref(e);
                            refInput.current = e;
                        }}
                        disabled={disabled}
                        onKeyDown={handleOnPress}
                        defaultValue={defaultValue}
                        placeholder={placeholder}
                        className={`w-full items-center focus:outline-none py-4 bg-transparent disabled:cursor-not-allowed ${
                            type === 'password' && 'font-extrabold tracking-widest'
                        }`}
                    />
                ) : (
                    <textarea
                        {...register(name, { ...options })}
                        ref={(e) => {
                            ref(e);
                            refTextArea.current = e;
                        }}
                        onKeyDown={handleOnPress}
                        placeholder={placeholder}
                        disabled={disabled}
                        defaultValue={defaultValue}
                        rows={1}
                        className={`items-center w-full py-4 overflow-y-auto bg-transparent resize-none hover:scrollbar-show max-h-28 h-fit focus:outline-none ${
                            disabled && 'cursor-not-allowed'
                        }`}
                    ></textarea>
                )}
                {/* {iconEnds && <div className="flex items-end gap-3 pb-[14px]">{iconEnds}</div>} */}
                <div className="flex items-end gap-3 pb-[14px]">
                    {isHasEmojiIcon && (
                        <div ref={refIconEmoji} className={`${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                            <RiUserSmileLine
                                aria-disabled={disabled}
                                onClick={handleShowPickerEmoji}
                                size={24}
                                key={1}
                            />
                        </div>
                    )}
                    {isHasPhotoIcon && (
                        <>
                            <BsImage
                                aria-disabled={disabled}
                                onClick={openInputFile}
                                className={`${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                size={24}
                                key={2}
                            />
                            <input
                                ref={refInputFile}
                                type="file"
                                disabled={disabled}
                                multiple={isMultipleImages}
                                onChange={handleInputFileChange}
                                accept="image/png,image/jpg,image/jpeg"
                                className="hidden"
                            />
                        </>
                    )}
                </div>
                {isHasEmojiIcon && (
                    <div ref={refPickerEmoji} className="absolute z-10 hidden translate-x-1/2 right-1/4 bottom-full">
                        <Picker onEmojiClick={onEmojiClick} />
                    </div>
                )}
            </div>
            {errors && (
                <div className="flex items-center gap-1">
                    <TiWarning size={14} fill="#ef4444" />
                    <p className="text-red-500">{errors}</p>
                </div>
            )}
        </>
    );
};
