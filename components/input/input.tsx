import { useEffect, useRef, useState } from 'react';
import { RegisterOptions, UseFormRegister } from 'react-hook-form';
import { TiWarning } from 'react-icons/ti';
import dynamic from 'next/dynamic';
import { RiUserSmileLine } from 'react-icons/ri';
import { BsImage } from 'react-icons/bs';
const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });

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
}: Props) => {
    const refTextArea = useRef<HTMLTextAreaElement>(null);
    const refContainer = useRef<HTMLDivElement>(null);
    const refPickerEmoji = useRef<HTMLDivElement>(null);
    const refIconEmoji = useRef<HTMLDivElement>(null);

    const onEmojiClick = (event: any, emojiObject: any) => {
        console.log('hi');
    };

    const handleShowPickerEmoji = () => {
        if (refPickerEmoji.current) {
            refPickerEmoji.current.classList.remove('hidden');
        }
    };
    function autosize() {
        if (refTextArea.current) {
            refTextArea.current.style.height = 'auto';
            refTextArea.current.style.height = refTextArea.current.scrollHeight + 'px';
        }
    }
    useEffect(() => {
        const handleClickOutsideBox = (event: MouseEvent) => {
            console.log('da vo');
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
                ref={refContainer}
                className={`${border ? 'border' : ''} flex ${
                    background ? 'bg-secondary-10' : 'bg-white'
                }  px-[10px] gap-3 relative rounded-lg focus-within:border-secondary-30 `}
            >
                <div className="flex items-center ">{icon}</div>
                {!isTextArea ? (
                    <input
                        {...register(name, { ...options })}
                        type={type}
                        defaultValue={defaultValue}
                        placeholder={placeholder}
                        multiple={true}
                        className={`w-full items-center focus:outline-none py-4 bg-transparent ${
                            type === 'password' && 'font-extrabold tracking-widest'
                        }`}
                    />
                ) : (
                    <textarea
                        {...register(name, { ...options })}
                        ref={refTextArea}
                        placeholder={placeholder}
                        defaultValue={defaultValue}
                        rows={1}
                        className="items-center w-full py-4 overflow-y-hidden bg-transparent h-fit focus:outline-none"
                    ></textarea>
                )}
                {/* {iconEnds && <div className="flex items-end gap-3 pb-[14px]">{iconEnds}</div>} */}
                <div className="flex items-end gap-3 pb-[14px]">
                    {isHasEmojiIcon && (
                        <div ref={refIconEmoji} className="cursor-pointer">
                            <RiUserSmileLine onClick={handleShowPickerEmoji} size={24} key={1} />
                        </div>
                    )}
                    {isHasPhotoIcon && <BsImage className="cursor-pointer" size={24} key={2} />}
                </div>
                {isHasEmojiIcon && (
                    <div ref={refPickerEmoji} className="absolute right-0 z-10 hidden translate-x-1/2 top-10">
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
