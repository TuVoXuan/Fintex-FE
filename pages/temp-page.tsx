import { CgSpinnerTwo } from 'react-icons/cg';

export default function TempPage() {
    return (
        <section className="flex items-center justify-center w-full h-screen">
            <CgSpinnerTwo className="animate-spin" size={50} />
        </section>
    );
}
