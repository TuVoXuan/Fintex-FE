import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../hook/redux';
import { selectFriend } from '../../redux/reducers/friend-slice';

interface Props {
    participants: IParticipant[];
}

export default function AvatarChat({ participants }: Props) {
    const sOnlineFriends = useAppSelector(selectFriend).onlineFriends;

    const [isOnlineConv, setIsOnlineConv] = useState<boolean>(false);

    const handleOnline = () => {
        participants.forEach((item) => {
            const indexOnline = sOnlineFriends.findIndex((user) => user._id === item._id);
            if (indexOnline >= 0) {
                return true;
            }
        });
        return false;
    };

    useEffect(() => {
        setIsOnlineConv(handleOnline());
    }, [sOnlineFriends]);

    if (participants.length === 1) {
        return (
            <section className="relative">
                <div className="overflow-hidden rounded-full w-14 h-14 image-container">
                    <Image
                        src={participants[0].avatar}
                        alt="avatar"
                        layout="fill"
                        objectFit="cover"
                        placeholder="blur"
                        blurDataURL="/images/avatar.jpg"
                    />
                </div>
                {isOnlineConv && (
                    <p className="absolute bottom-0 right-0 w-4 h-4 bg-green-600 rounded-full ring-2 ring-white"></p>
                )}
            </section>
        );
    }

    return (
        <section className="relative w-14 h-14">
            <div className="absolute overflow-hidden rounded-full border-2 border-transparent w-10 h-10 translate-x-[50%] image-container">
                <Image
                    src={participants[0].avatar}
                    alt="avatar"
                    layout="fill"
                    objectFit="cover"
                    placeholder="blur"
                    blurDataURL="/images/avatar.jpg"
                />
            </div>
            <div className="-translate-y-[50%] absolute w-10 h-10 overflow-hidden border-2 border-white rounded-full image-container">
                <Image
                    src={participants[1].avatar}
                    alt="avatar"
                    layout="fill"
                    objectFit="cover"
                    placeholder="blur"
                    blurDataURL="/images/avatar.jpg"
                />
            </div>

            {isOnlineConv && (
                <p className="absolute bottom-0 right-0 w-3 h-3 bg-green-600 rounded-full ring-2 ring-white"></p>
            )}
        </section>
    );
}
