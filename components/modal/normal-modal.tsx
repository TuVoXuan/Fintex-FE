import { useRef } from 'react';

interface Props {
    title: string;
    subTitle: string;
    acceptBtnTitle: string;
    cancleBtnTitle: string;
    onAccept: () => void;
    onCancle: () => void;
}

export default function NormalModal({ acceptBtnTitle, cancleBtnTitle, onAccept, onCancle, subTitle, title }: Props) {
    const modalRef = useRef<HTMLDivElement>(null);

    const handleClickOutSideModal = (event: any) => {
        const { target } = event;

        if (modalRef.current && target && 'nodeType' in target) {
            if (!modalRef.current.contains(target)) {
                onCancle();
            }
        }
    };
    return (
        <section
            onClick={handleClickOutSideModal}
            className="fixed top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-center bg-secondary-80/60"
        >
            <div
                ref={modalRef}
                className="w-1/3 overflow-hidden bg-white rounded-lg border-[1.5px] border-t-secondary-30"
            >
                <div className="px-8">
                    <h3 className="mt-6 mb-4">{title}</h3>
                    <p className="mb-6">{subTitle}</p>
                </div>
                <div className="flex gap-x-3 p-8 border-t-[1.5px] border-t-secondary-30 bg-secondary-20">
                    <button onClick={onAccept} className="w-full btn btn-primary">
                        {acceptBtnTitle}
                    </button>
                    <button onClick={onCancle} className="w-full text-black bg-white btn">
                        {cancleBtnTitle}
                    </button>
                </div>
            </div>
        </section>
    );
}
