import { createContext } from 'react';

export interface ContextTypes {
    selectVersion: string;
    groupName: string;
    groupCode: string;
    loading: boolean;
}

export default createContext<ContextTypes>(
    {
        selectVersion: '',
        groupName: '',
        groupCode: '',
        loading: false
    });