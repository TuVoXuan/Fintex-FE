import { NextPage } from 'next';
import { AppProps } from 'next/app';

export type NextPageWithProtect = NextPage & {
    protected?: boolean;
};

export type AppPropsWithProtect = AppProps & {
    Component: NextPageWithProtect;
};
