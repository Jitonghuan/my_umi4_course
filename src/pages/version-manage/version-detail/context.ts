import { createContext } from 'react';

export interface ContextTypes {
    selectVersion: string;
    groupName: string;
    groupCode: string;
}

export default createContext<ContextTypes>(
    {
        selectVersion: '',
        groupName: '',
        groupCode: '',
    });