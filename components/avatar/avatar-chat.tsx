import Image from 'next/image';
import { useEffect, useState, memo } from 'react';
import { useAppDispatch, useAppSelector } from '../../hook/redux';
import { selectConversations, setLastActive, setOnline } from '../../redux/reducers/conversation-slice';
import { selectFriend } from '../../redux/reducers/friend-slice';
import { selectUser } from '../../redux/reducers/user-slice';

interface Props {
    conversationId: string;
    onlyDisplay?: boolean;
    participants: IParticipant[];
    size: 'medium' | 'small';
}

function AvatarChat({ participants, size, conversationId, onlyDisplay = false }: Props) {
    const dispatch = useAppDispatch();
    const sOnlineFriends = useAppSelector(selectFriend).onlineFriends;
    const sConv = useAppSelector(selectConversations).find((item) => item._id === conversationId);
    const sUser = useAppSelector(selectUser).data;

    const handleSecondAvatar = () => {
        if (sConv && sConv.participants.length > 1) {
            return sConv.participants[1].avatar;
        } else if (sUser) {
            return sUser.avatar;
        }
        return '';
    };

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
                        src={handleSecondAvatar()}
                        alt="avatar"
                        layout="fill"
                        objectFit="cover"
                        placeholder="blur"
                        blurDataURL="/images/avatar.jpg"
                    />
                </div>
            </div>

            {sConv && sConv.isOnline && size === 'medium' && (
                <p className="absolute bottom-0 right-0 w-4 h-4 bg-green-600 rounded-full ring-2 ring-white"></p>
            )}
        </section>
    );
}

export default memo(AvatarChat, (prevProps, nextProps) => {
    if (
        prevProps.conversationId === nextProps.conversationId &&
        prevProps.onlyDisplay === nextProps.onlyDisplay &&
        prevProps.participants === nextProps.participants &&
        prevProps.size === nextProps.size
    ) {
        return true;
    }
    return false;
});
