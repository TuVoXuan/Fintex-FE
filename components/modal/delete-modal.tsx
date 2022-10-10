import { useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import { VscLoading } from 'react-icons/vsc';

interface Props {
    onClose: () => void;
    onDelete: () => void;
    loading: boolean;
    objectName: string;
}

export default function DeleteModal({ onClose, onDelete, objectName, loading }: Props) {
    const deleteModalRef = useRef<HTMLDivElement>(null);

    const handleShowModal = () => {
        if (deleteModalRef.current) {
            if (deleteModalRef.current.classList.contains('-top-[100%]')) {
                deleteModalRef.current.classList.remove('-top-[100%]');
                deleteModalRef.current.classList.add('top-[10%]');
            }
        }
    };

    const handleClickOutSideModal = (event: any) => {
        const { target } = event;

        if (deleteModalRef.current && target && 'nodeType' in target) {
            if (!deleteModalRef.current.contains(target)) {
                onClose();
            }
        }
    };

    useEffect(() => {
        setTimeout(() => {
            handleShowModal();
        }, 100);
    }, []);

    return (
        <div
            onClick={handleClickOutSideModal}
            className="fixed top-0 bottom-0 left-0 right-0 z-10 flex justify-center bg-secondary-80/60"
        >
            <div
                ref={deleteModalRef}
                className="py-4 px-6 bg-white rounded-lg w-[35%] h-fit relative -top-[100%] transition-all duration-1000 ease-in-out"
            >
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="p-1 transition-colors duration-150 ease-linear bg-white rounded-full hover:bg-secondary-20"
                    >
                        <IoClose size={24} />
                    </button>
                </div>
                <div>
                    <p className="font-semibold">{`Bạn có thật sự muốn xóa ${objectName} này không?`}</p>
                    <p>Một khi xóa là không thể khôi phục lại được.</p>
                </div>
                <div className="flex justify-end mt-5 gap-x-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 transition-colors duration-150 ease-linear rounded-md hover:bg-secondary-20"
                    >
                        Hủy bỏ
                    </button>
                    {loading ? (
                        <button className="px-4 py-2 text-white transition-colors duration-150 ease-linear bg-red-500 rounded-md cursor-not-allowed hover:bg-red-600 drop-shadow-lg ">
                            <VscLoading className="animate-spin" size={24} />
                        </button>
                    ) : (
                        <button
                            onClick={onDelete}
                            className="px-4 py-2 text-white transition-colors duration-150 ease-linear bg-red-500 rounded-md hover:bg-red-600 drop-shadow-lg "
                        >
                            Xóa
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
