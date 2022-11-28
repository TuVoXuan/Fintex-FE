import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoClose } from 'react-icons/io5';
import { VscLoading } from 'react-icons/vsc';
import { useAppDispatch, useAppSelector } from '../../hook/redux';
import { renameGroupConv } from '../../redux/actions/conversation-action';
import { selectConversations } from '../../redux/reducers/conversation-slice';
import { selectUser } from '../../redux/reducers/user-slice';
import { Button } from '../button/button';
import GroupChatCard from '../card/group-chat-card';
import NavItem from '../nav-item/nav-item';

interface FormData {
    groupName: string;
}

interface Props {
    convId: string;
    onClose: () => void;
}

export default function SettingGroupChatModal({ convId, onClose }: Props) {
    const sConv = useAppSelector(selectConversations).find((conv) => conv._id === convId);
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<FormData>({
        defaultValues: {
            groupName: sConv?.name,
        },
    });
    const createConvModalRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const sUser = useAppSelector(selectUser).data;
    const isAdmin: boolean = sUser?._id === sConv?.admin?._id;

    const [activeTab, setActiveTab] = useState<'all' | 'admin'>('all');
    const [submitted, setSubmitted] = useState(false);

    const handleSwitchPage = (value: 'all' | 'admin') => () => {
        setActiveTab(value);
    };

    const handleClickOutSideModal = (event: any) => {
        const { target } = event;

        if (createConvModalRef.current && target && 'nodeType' in target) {
            if (!createConvModalRef.current.contains(target)) {
                onClose();
            }
        }
    };

    const onSubmit = async (value: FormData) => {
        try {
            setSubmitted(true);
            await dispatch(
                renameGroupConv({
                    name: value.groupName,
                    conversationId: sConv?._id || '',
                }),
            ).unwrap();
            setSubmitted(false);
        } catch (error) {
            console.log('error: ', error);
        }
    };

    return (
        <section
            onClick={handleClickOutSideModal}
            className="fixed top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-center bg-secondary-80/60"
        >
            <div ref={createConvModalRef} className="flex flex-col w-1/3 overflow-hidden bg-white rounded-lg h-2/3">
                <div className="flex items-center justify-between p-3 border-b border-secondary-20">
                    <h3>Cài đặt nhóm chat</h3>
                    <button
                        onClick={onClose}
                        className="p-2 transition-colors duration-300 ease-linear bg-white rounded-full hover:bg-secondary-20"
                    >
                        <IoClose size={20} />
                    </button>
                </div>
                <div className="flex flex-col flex-1 p-3 overflow-hidden gap-y-3">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        id="rename-conversation"
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center gap-x-3">
                            <label htmlFor="groupName">Tên nhóm: </label>
                            <input
                                disabled={!isAdmin}
                                className="px-2 py-3 border rounded-lg focus:outline-none focus:border-slate-300"
                                type="text"
                                id="groupName"
                                {...register('groupName')}
                                defaultValue={sConv?.name}
                            />
                        </div>

                        {isAdmin ? (
                            <Button
                                form="rename-conversation"
                                color="primary"
                                title="Cập nhập"
                                typeBtn="submit"
                                className="px-3 w-fit"
                                disable={submitted}
                            />
                        ) : (
                            <Button className="px-3 w-fit" color="secondary-light" title="Cập nhập" disable />
                        )}
                    </form>
                    <div className="flex flex-col flex-1 overflow-hidden">
                        <div className="flex justify-center">
                            <NavItem
                                title="Thành viên"
                                actived={activeTab === 'all'}
                                onClick={handleSwitchPage('all')}
                            />
                            <NavItem
                                title="Quản trị"
                                actived={activeTab === 'admin'}
                                onClick={handleSwitchPage('admin')}
                            />
                        </div>
                        {activeTab === 'all' ? (
                            // all member tab
                            <div className="flex-1 overflow-y-auto hover:scrollbar-show">
                                {sConv && sConv.admin && (
                                    <GroupChatCard
                                        conversationId={sConv._id}
                                        adminId={sConv.admin._id}
                                        participant={sConv.admin}
                                    />
                                )}
                                {sConv &&
                                    [
                                        ...sConv.participants,
                                        {
                                            _id: sUser?._id,
                                            name: sUser?.name,
                                            avatar: sUser?.avatar,
                                        } as IParticipant,
                                    ]
                                        .filter((item) => item._id !== sConv.admin?._id)
                                        .map((item) => (
                                            <GroupChatCard
                                                conversationId={sConv._id}
                                                adminId={sConv.admin?._id}
                                                participant={item}
                                            />
                                        ))}
                            </div>
                        ) : (
                            // admin tab
                            <>
                                {sConv?.admin && (
                                    <div className="flex-1 overflow-y-auto hover:scrollbar-show">
                                        <GroupChatCard
                                            conversationId={sConv._id}
                                            adminId={sConv.admin._id}
                                            participant={sConv.admin}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
