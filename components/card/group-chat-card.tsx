import { useRef, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { useAppDispatch, useAppSelector } from '../../hook/redux';
import { removeMember, switchAdmin } from '../../redux/actions/conversation-action';
import { selectConversations } from '../../redux/reducers/conversation-slice';
import { selectUser } from '../../redux/reducers/user-slice';
import { toastError } from '../../util/toast';
import Avatar from '../avatar/avatar';
import DeleteModal from '../modal/delete-modal';

interface Props {
    adminId: string | undefined;
    participant: IParticipant;
    conversationId: string;
    onClose: () => void;
}

export default function GroupChatCard({ adminId, participant, conversationId, onClose }: Props) {
    const sUser = useAppSelector(selectUser).data;
    const popupRef = useRef<HTMLDivElement>(null);
    const [showPopup, setshowPopup] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const numParticipants = useAppSelector(selectConversations).find((conv) => conv._id === conversationId)
        ?.participants.length;

    const handleSwitchAdmin = async () => {
        try {
            await dispatch(
                switchAdmin({
                    conversationId,
                    member: participant._id,
                }),
            ).unwrap();
        } catch (error) {
            console.log('error: ', error);
            toastError((error as IResponseError).error);
        }
    };

    const handleRemoveMember = async () => {
        try {
            await dispatch(removeMember({ conversationId, member: participant._id })).unwrap();
            handleShowDeleteModal();
            if (numParticipants === 1) {
                onClose();
            }
        } catch (error) {
            toastError((error as IResponseError).error);
        }
    };

    const handleShowDeleteModal = () => {
        setShowDeleteModal(!showDeleteModal);
    };

    const handleShowPopup = () => {
        setshowPopup(!showPopup);
    };

    return (
        <section className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center gap-x-3 prevent-select">
                <Avatar size="medium" url={participant.avatar} />
                <h4>{participant.name.fullName}</h4>
            </div>
            {sUser && sUser._id === adminId && sUser._id !== participant._id && (
                <button
                    onClick={handleShowPopup}
                    className="relative p-2 transition-colors duration-300 bg-white rounded-full hover:bg-secondary-20"
                >
                    <BsThreeDots size={20} />
                    {showPopup && (
                        <div
                            ref={popupRef}
                            className="absolute right-[50%] top-[50%] border-[1.5px] rounded-lg bg-secondary-10 z-10"
                        >
                            <div className="p-1 border-b-[1.5px]">
                                <button
                                    onClick={handleSwitchAdmin}
                                    className="px-3 py-2 transition-colors duration-300 ease-linear rounded-lg hover:bg-secondary-20 whitespace-nowrap"
                                >
                                    Nhường Admin
                                </button>
                            </div>
                            <div className="p-1">
                                <button
                                    onClick={handleShowDeleteModal}
                                    className="px-3 py-2 transition-colors duration-300 ease-linear rounded-lg whitespace-nowrap hover:bg-secondary-20"
                                >
                                    Xóa thành viên
                                </button>
                            </div>
                        </div>
                    )}
                </button>
            )}
            {showDeleteModal && (
                <DeleteModal
                    objectName="thành viên"
                    onClose={handleShowDeleteModal}
                    onDelete={handleRemoveMember}
                    loading={false}
                />
            )}
        </section>
    );
}
