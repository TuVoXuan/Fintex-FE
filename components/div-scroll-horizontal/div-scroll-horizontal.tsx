import React, { useEffect, useRef } from 'react';

export default function DivScrollHorizontal(
    props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.addEventListener('wheel', (evt) => {
                evt.preventDefault();
                if (ref.current) {
                    ref.current.scrollLeft += evt.deltaY + 2;
                }
            });
        }
    }, []);

    return <div ref={ref} {...props}></div>;
}
