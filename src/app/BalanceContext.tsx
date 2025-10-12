'use client'

import { createContext, useContext, useState } from 'react'

interface BalanceContextType {
    refreshFlag: number
    triggerRefresh: () => void
}

const BalanceContext = createContext<BalanceContextType>({
    refreshFlag: 0,
    triggerRefresh: () => {},
})

export const BalanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [refreshFlag, setRefreshFlag] = useState(0)

    const triggerRefresh = () => setRefreshFlag((prev) => prev + 1)

    return (
        <BalanceContext.Provider value={{ refreshFlag, triggerRefresh }}>
            {children}
        </BalanceContext.Provider>
    )
}

export const useBalanceContext = () => useContext(BalanceContext)
