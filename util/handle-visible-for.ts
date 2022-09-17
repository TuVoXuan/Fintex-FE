export function translateVisibleFor(visibleFor: string): string {
    if (visibleFor === 'friends') {
        return 'Bạn bè';
    }
    if (visibleFor === 'only me') {
        return 'Chỉ mình tôi';
    }
    return 'Công khai';
}
