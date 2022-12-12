import { createContext } from 'react';

export interface ContextTypes {
    releaseId: any;
    categoryName: string;
    categoryCode: string;
}

export default createContext<ContextTypes>(
    {
        releaseId: '',
        categoryName: '',
        categoryCode: '',
    });