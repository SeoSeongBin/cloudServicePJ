import React, { createContext, useState, useContext, useEffect } from 'react';

const StorageContext = createContext();

export const StorageProvider = ({ children }) => {
    const [usedStorage, setUsedStorage] = useState(0);
    const [usedStoragePer, setUsedStoragePer] = useState(0);

    // DB에서 현재 총 용량을 가져오는 함수
    const fetchStorage = () => {
        fetch('/api/fileUseStorage',{
            method: 'POST', // 메서드를 POST로 명시
            headers: {
                'Content-Type': 'application/json', // JSON을 보낸다고 알림
            },
            body: JSON.stringify({}), // 빈 객체라도 Body에 넣어줌
        }) // 서버의 용량 조회 API
            .then(res => res.json())
            .then(data => {
                console.log(data);
                let useStorageGet = (data.useStorage / (1024 ** 3)).toFixed(1);
                let storagePercent = (useStorageGet / 10 * 100).toFixed(0);
                setUsedStorage(useStorageGet);
                setUsedStoragePer(storagePercent);
            })
            .catch(err => console.error("용량 조회 실패:", err));
    };

    // 처음 앱이 켜질 때 한 번 실행
    useEffect(() => {
        // fetchStorage();
    }, []);

    return (
        <StorageContext.Provider value={{ usedStorage, usedStoragePer, fetchStorage }}>
            {children}
        </StorageContext.Provider>
    );
};

export const useStorage = () => useContext(StorageContext);