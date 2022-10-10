import { useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import { VscLoading } from 'react-icons/vsc';

export default function TempPage() {
    const deleteModalRef = useRef<HTMLDivElement>(null);

    const handleShowModal = () => {
        if (deleteModalRef.current) {
            if (deleteModalRef.current.classList.contains('-top-[100%]')) {
                deleteModalRef.current.classList.remove('-top-[100%]');
                deleteModalRef.current.classList.add('top-[10%]');
            }
        }
    };
    return (
        <div
            // onClick={handleClickOutSideFormPost}
            className="fixed top-0 bottom-0 left-0 right-0 z-10 flex justify-center bg-secondary-80/60"
        >
            <button onClick={handleShowModal} className="p-3 bg-yellow-400 rounded">
                click me
            </button>
            <div
                ref={deleteModalRef}
                className="py-4 px-6 bg-white rounded-lg w-[35%] h-fit relative -top-[100%] transition-all duration-1000 ease-in-out"
            >
                <div className="flex justify-end">
                    <button className="p-1 transition-colors duration-150 ease-linear bg-white rounded-full hover:bg-secondary-20">
                        <IoClose size={24} />
                    </button>
                </div>
                <div>
                    <p className="font-semibold">Bạn có thật sự muốn xóa bài post này không?</p>
                    <p>Một khi xóa là không thể khôi phục lại được.</p>
                </div>
                <div className="flex justify-end mt-5 gap-x-6">
                    <button className="px-4 py-2 transition-colors duration-150 ease-linear rounded-md hover:bg-secondary-20">
                        Hủy bỏ
                    </button>
                    <button className="px-4 py-2 text-white transition-colors duration-150 ease-linear bg-red-500 rounded-md hover:bg-red-600 drop-shadow-lg ">
                        Xóa
                    </button>
                    <button className="px-4 py-2 text-white transition-colors duration-150 ease-linear bg-red-500 rounded-md cursor-not-allowed hover:bg-red-600 drop-shadow-lg ">
                        <VscLoading className="animate-spin" size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
}
