export function handleFullName(fullName: string): INameUser {
    if (!fullName)
        return {
            firstName: '',
            lastName: '',
        };

    const newFullName = fullName.trim();
    const chars = newFullName.split(' ');
    const firstName = chars[0];
    const lastName = chars.reduce((pre, curr, index) => {
        if (index !== 0) pre = pre + ' ' + curr;
        return pre.trim();
    }, '');

    return {
        firstName,
        lastName,
    };
}
