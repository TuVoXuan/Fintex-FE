import Avatar from '../avatar/avatar';

interface Props {
    avatar: string;
    fullName: string;
    isFriend: boolean;
    address: string;
}

export default function StrangerCard({ avatar, fullName, isFriend, address }: Props) {
    return (
        <div className="flex items-center justify-between px-4 py-4 bg-white rounded-lg shadow-light">
            <div className="flex items-center gap-3">
                <Avatar size="semi-large" url={avatar} />
                <div>
                    <p className="font-semibold">{fullName}</p>
                    <p>{address}</p>
                </div>
            </div>
            <button className="p-3 font-semibold text-blue-600 bg-blue-100 rounded-md hover:bg-blue-300">
                {isFriend ? 'Nhắn tin' : 'Thêm bạn bè'}
            </button>
        </div>
    );
}
