export const isMessageSeen = (message: IMessage): boolean => {
    for (let i = message.message.length - 1; i >= 0; i--) {
        if (message.message[i].seen.length > 0) {
            return true;
        }
    }

    return false;
};
