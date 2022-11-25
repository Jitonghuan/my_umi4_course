import { createContext } from 'react';

export interface ContextTypes {
    releaseId: any;
    categoryName: string;
    categoryCode: string;
    loading: boolean;
}

export default createContext<ContextTypes>(
    {
        releaseId: '',
        categoryName: '',
        categoryCode: '',
        loading: false
    });