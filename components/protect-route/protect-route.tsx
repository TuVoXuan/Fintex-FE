import { useRouter } from 'next/router';
import APP_PATH from '../../constants/app-path';
import { useAppSelector } from '../../hook/redux';
import { selectUser } from '../../redux/reducers/user-slice';

interface Props {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: Props) {
    const router = useRouter();
    const sUser = useAppSelector(selectUser);

    function render() {
        if (!sUser.isLogin) {
            router.push(APP_PATH.SIGN_IN);
            return null;
        }

        return <>{children}</>;
    }

    return render();
}
