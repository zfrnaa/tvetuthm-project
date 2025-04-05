import { useContext, createContext } from 'react';
import type { UserContextType } from './UserContext'; // You'll need to export this type

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser(): UserContextType {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}