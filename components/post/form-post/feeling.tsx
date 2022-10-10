import { useEffect, useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { BsSearch } from 'react-icons/bs';
import { IoArrowBackOutline } from 'react-icons/io5';
import { useAppDispatch, useAppSelector } from '../../../hook/redux';
import { feelingGetAll } from '../../../redux/actions/feeling-action';
import { selectFeeling } from '../../../redux/reducers/feeling-slice';
import { toastError } from '../../../util/toast';
import FeelingBtn from './feeling-btn';

// const feelings: IFeeling[] = [
//     { name: 'rất vui', emoji: '😀' },
//     { name: 'rất rất vui', emoji: '😁' },
//     { name: 'hạnh phúc', emoji: '🥰' },
//     { name: 'hơi ngại', emoji: '😅' },
//     { name: 'buồn cười', emoji: '🤣' },
//     { name: 'ngạc nhiên', emoji: '😮' },
//     { name: 'buồn ngủ', emoji: '🥱' },
//     { name: 'sợ hãi', emoji: '😱' },
//     { name: 'tức giận', emoji: '🤬' },
//     { name: 'muốn khóc to', emoji: '😭' },
//     { name: 'buồn nôn', emoji: '🤢' },
//     { name: 'choáng váng', emoji: '😵‍💫' },
//     { name: 'sung sướng', emoji: '😊' },
//     { name: 'tuyệt', emoji: '😎' },
//     { name: 'thư giản', emoji: '😌' },
//     { name: 'may mắn', emoji: '🤑' },
//     { name: 'buồn tẻ', emoji: '😔' },
// ];

interface Props {
    onClose: () => void;
    onFeeling: (fell: IFeeling) => () => void;
}

export default function Feeling({ onClose, onFeeling: onFelling }: Props) {
    const dispatch = useAppDispatch();
    const sFeeling = useAppSelector(selectFeeling);
    const [loading, setLoading] = useState<boolean>(sFeeling.data.length > 0 ? false : true);

    useEffect(() => {
        const getFeelings = async () => {
            await dispatch(feelingGetAll());
        };

        try {
            if (sFeeling.data.length === 0) {
                getFeelings();
            }
            setLoading(false);
        } catch (error) {
            toastError((error as IResponseError).error);
        }
    }, []);

    return (
        <>
            <div className="relative text-center">
                <h3>Bạn đang cảm thấy thế nào?</h3>
                <button
                    onClick={onClose}
                    className="absolute left-0 p-2 -translate-y-1/2 rounded-full top-1/2 bg-secondary-20 hover:bg-secondary-30"
                >
                    <IoArrowBackOutline size={20} />
                </button>
            </div>
            <hr />
            <div>
                <div className="flex items-center px-3 overflow-hidden bg-secondary-20 rounded-3xl">
                    <BsSearch size={16} />
                    <input type="text" className="pt-2 px-[6px] pb-3 bg-inherit focus: outline-none w-full" />
                </div>
                <div className="pt-6 overflow-y-auto max-h-64">
                    {loading ? (
                        <div className="flex justify-center">
                            <AiOutlineLoading3Quarters className="animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-2">
                            {sFeeling.data.map((feeling) => (
                                <FeelingBtn
                                    key={feeling.name + Date.now().toString()}
                                    feeling={feeling}
                                    onClick={onFelling(feeling)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
