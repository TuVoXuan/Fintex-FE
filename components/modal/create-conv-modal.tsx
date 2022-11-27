import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiSearch } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAppDispatch, useAppSelector } from '../../hook/redux';
import { userGetFriends } from '../../redux/actions/user-action';
import { selectFriend } from '../../redux/reducers/friend-slice';
import { toastError } from '../../util/toast';
import { Button } from '../button/button';
import FriendConvCard from '../card/friend-conv-card';
import { Input } from '../input/input';
import LoadingFriendConvCard from '../loading/loading-friend-conv-card';
import Image from 'next/image';
import { createConversation, createGroupConversation } from '../../redux/actions/conversation-action';
import { VscLoading } from 'react-icons/vsc';

interface Props {
    onClose: () => void;
}

interface FormData {
    search: string;
}

export default function CreateConvModal({ onClose }: Props) {
    const dispatch = useAppDispatch();
    const sFriends = useAppSelector(selectFriend).friends;

    const { register, watch } = useForm<FormData>();
    const createConvModalRef = useRef<HTMLDivElement>(null);

    const watchSearch = watch('search');

    const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
    const [searchFriends, setSearchFriends] = useState<IFriend[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [convName, setConvName] = useState<string>('');
    const [error, setError] = useState<boolean>();
    const [submitting, setSubmitting] = useState<boolean>(false);

    const handleSelectFriends = (friendId: string) => () => {
        const index = selectedFriends.findIndex((item) => item === friendId);
        if (index >= 0) {
            setSelectedFriends((value) => value.filter((item) => item !== friendId));
        } else {
            setSelectedFriends([...selectedFriends, friendId]);
        }
    };

    const handleClickOutSideModal = (event: any) => {
        const { target } = event;

        if (!submitting) {
            if (createConvModalRef.current && target && 'nodeType' in target) {
                if (!createConvModalRef.current.contains(target)) {
                    onClose();
                }
            }
        }
    };

    const handleClose = () => {
        if (!submitting) {
            onClose();
        }
    };

    const fetchFriends = async () => {
        try {
            await dispatch(userGetFriends({ limit: 9, after: sFriends.after }));
        } catch (error) {
            toastError((error as IResponseError).error);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            if (selectedFriends.length === 1) {
                await dispatch(createConversation(selectedFriends[0])).unwrap();
            } else if (convName !== '') {
                await dispatch(createGroupConversation({ friendIds: selectedFriends, name: convName })).unwrap();
            } else {
                setError(true);
                setSubmitting(false);
                return;
            }
        } catch (error) {
            toastError((error as IResponseError).error);
        }

        onClose();
    };

    useEffect(() => {
        if (sFriends.data.length === 0) {
            dispatch(userGetFriends({ limit: 9 })).catch((error) => toastError(error));
        }
    }, []);

    useEffect(() => {
        if (isSearching && watchSearch === '') {
            setIsSearching(false);
        } else {
            setIsSearching(true);
        }

        setIsTyping(true);

        const delayDebounce = setTimeout(() => {
            if (watchSearch) {
                const searchKey = watchSearch.toLowerCase();
                const searchResult = sFriends.data.filter((item) =>
                    item.name.fullName.toLowerCase().includes(searchKey),
                );
                setSearchFriends(searchResult);
                setIsTyping(false);
            }
        }, 2000);

        return () => {
            clearTimeout(delayDebounce);
        };
    }, [watchSearch]);

    return (
        <section
            onClick={handleClickOutSideModal}
            className="fixed top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-center bg-secondary-80/60"
        >
            <div ref={createConvModalRef} className="w-1/3 py-4 space-y-3 bg-white rounded-lg h-2/3">
                <div className="flex items-center justify-between px-4">
                    <h3>Tạo nhóm chat</h3>
                    <button
                        onClick={handleClose}
                        className="p-2 transition-colors duration-150 ease-linear rounded-full hover:bg-secondary-10"
                    >
                        <IoClose size={20} />
                    </button>
                </div>
                <div className="px-4">
                    <Input
                        name="search"
                        border={true}
                        placeholder="Tìm kiếm tại đây..."
                        icon={<FiSearch size={20} />}
                        type="text"
                        register={register}
                    />
                </div>
                <div id="friendConvCards" className="px-4 overflow-y-auto h-60 hover:scrollbar-show">
                    {isSearching ? (
                        <>
                            {isTyping ? (
                                <div>
                                    <LoadingFriendConvCard />
                                    <LoadingFriendConvCard />
                                    <LoadingFriendConvCard />
                                    <LoadingFriendConvCard />
                                </div>
                            ) : (
                                <>
                                    {searchFriends.length > 0 ? (
                                        searchFriends.map((item) => (
                                            <FriendConvCard
                                                key={item._id}
                                                selected={
                                                    selectedFriends.findIndex((fr) => fr === item._id) >= 0
                                                        ? true
                                                        : false
                                                }
                                                onClick={handleSelectFriends(item._id)}
                                                name={item.name.fullName}
                                                avatar={item.avatar}
                                            />
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <Image
                                                src={'/images/no-data-pana.svg'}
                                                height={180}
                                                width={180}
                                                placeholder="blur"
                                                alt="no data"
                                                blurDataURL="/images/avatar.jpg"
                                            />
                                            <p className="text-center">Không tìm thấy kết quả phù hợp</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <InfiniteScroll
                            next={() => {
                                if (sFriends.after !== 'end') {
                                    if (sFriends.after) {
                                        fetchFriends();
                                    }
                                }
                            }}
                            hasMore={sFriends.after !== 'end'}
                            loader={<LoadingFriendConvCard />}
                            dataLength={sFriends.data.length}
                            scrollableTarget="friendConvCards"
                        >
                            {sFriends.data.length > 0 ? (
                                sFriends.data.map((item) => (
                                    <FriendConvCard
                                        key={item._id}
                                        selected={
                                            selectedFriends.findIndex((fr) => fr === item._id) >= 0 ? true : false
                                        }
                                        onClick={handleSelectFriends(item._id)}
                                        name={item.name.fullName}
                                        avatar={item.avatar}
                                    />
                                ))
                            ) : (
                                <div className="flex flex-col items-center">
                                    <Image
                                        src={'/images/no-data-pana.svg'}
                                        height={200}
                                        width={200}
                                        placeholder="blur"
                                        alt="no data"
                                        blurDataURL="/images/avatar.jpg"
                                    />
                                    <p className="text-center">Không có dữ liệu</p>
                                </div>
                            )}
                        </InfiniteScroll>
                    )}
                </div>
                <div className="flex px-4 gap-x-3">
                    <input
                        onChange={(e) => setConvName(e.target.value)}
                        disabled={selectedFriends.length < 2}
                        type="text"
                        name="chat-name"
                        id="chat-name"
                        placeholder="Tên nhóm chat"
                        className={`w-full border-[1px] rounded-lg px-2 focus:outline-none ${
                            error && selectedFriends.length >= 2 && 'border-[1px] border-red-400'
                        }`}
                    />

                    {submitting ? (
                        <button disabled className="cursor-not-allowed btn bg-secondary-30">
                            <VscLoading className="animate-spin" size={18} />
                        </button>
                    ) : (
                        <Button onClick={handleSubmit} color="primary" title="Tạo" className="w-fit" />
                    )}
                </div>
            </div>
        </section>
    );
}
