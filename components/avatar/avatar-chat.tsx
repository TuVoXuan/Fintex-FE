import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hook/redux';
import { selectConversations, setLastActive, setOnline } from '../../redux/reducers/conversation-slice';
import { selectFriend } from '../../redux/reducers/friend-slice';

interface Props {
    conversationId: string;
    onlyDisplay?: boolean;
    participants: IParticipant[];
    size: 'medium' | 'small';
}

export default function AvatarChat({ participants, size, conversationId, onlyDisplay = false }: Props) {
    const dispatch = useAppDispatch();
    const sOnlineFriends = useAppSelector(selectFriend).onlineFriends;
    const sConv = useAppSelector(selectConversations).find((item) => item._id === conversationId);

    // const [isOnlineConv, setIsOnlineConv] = useState<boolean>(false);

    const handleOnline = () => {
        for (let i = 0; i < participants.length; i++) {
            const person = participants[i];
            const indexOnline = sOnlineFriends.findIndex((user) => user._id === person._id);
            if (indexOnline >= 0) {
                return true;
            }
        }
        return false;
    };

    useEffect(() => {
        if (!onlyDisplay) {
            // setIsOnlineConv(handleOnline());
            if (sConv) {
                const isOnlineConv = handleOnline();
                if (!isOnlineConv && sConv.isOnline) {
                    dispatch(setLastActive(conversationId));
                }

                dispatch(setOnline({ isOnline: isOnlineConv, conversationId }));
            }
        }
    }, [sOnlineFriends]);

    if (participants.length === 1) {
        return (
            <section className="relative">
                <div
                    className={`overflow-hidden rounded-full image-container ${
                        size === 'medium' ? 'w-14 h-14' : 'w-12 h-12'
                    }`}
                >
                    <Image
                        src={participants[0].avatar}
                        alt="avatar"
                        layout="fill"
                        objectFit="cover"
                        placeholder="blur"
                        blurDataURL="/images/avatar.jpg"
                    />
                </div>
                {sConv && sConv.isOnline && size === 'medium' && (
                    <p className="absolute bottom-0 right-0 w-4 h-4 bg-green-600 rounded-full ring-2 ring-white"></p>
                )}
            </section>
        );
    }

    return (
        <section className="relative ">
            <div className={`${size === 'medium' ? 'w-14 h-14' : 'w-12 h-12'}`}>
                <div
                    className={`absolute overflow-hidden rounded-full border-2 border-transparent translate-x-[50%] image-container ${
                        size === 'medium' ? 'w-10 h-10' : 'w-8 h-8'
                    }`}
                >
                    <Image
                        src={participants[0].avatar}
                        alt="avatar"
                        layout="fill"
                        objectFit="cover"
                        placeholder="blur"
                        blurDataURL="/images/avatar.jpg"
                    />
                </div>
                <div
                    className={`-translate-y-[50%] absolute overflow-hidden border-2 border-white rounded-full image-container ${
                        size === 'medium' ? 'w-10 h-10' : 'w-8 h-8'
                    }`}
                >
                    <Image
                        src={participants[1].avatar}
                        alt="avatar"
                        layout="fill"
                        objectFit="cover"
                        placeholder="blur"
                        blurDataURL="/images/avatar.jpg"
                    />
                </div>
            </div>

            {sConv && sConv.isOnline && size === 'medium' && (
                <p className="absolute bottom-0 right-0 w-3 h-3 bg-green-600 rounded-full ring-2 ring-white"></p>
            )}
        </section>
    );
}
