import Avatar from '../avatar/avatar';

interface Props {
    avatar: string;
    name: string;
    message: string;
}

export default function ChatNotify({ avatar, name, message }: Props) {
    return (
        <section className="flex justify-center">
            <div
                title="2022/20/10 12:12:12"
                className="relative flex items-center px-4 py-2 rounded-full group bg-secondary-10 gap-x-3"
            >
                <Avatar url={avatar} size="tiny" />
                <p className="prevent-select">
                    <span className="font-semibold text-gray-600">{name}</span> {message}
                </p>
                {/* <span className="top-tooltip">2022/10/10 12:19:09</span> */}
            </div>
        </section>
    );
}
