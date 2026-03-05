import React, { useState } from 'react';
import { useStorage } from './StorageContext';

export default function Navi() {
    const menuTitName = "Menu List"
    const [activeIndex, setActiveIndex] = useState(0);
    const menuList = ["My Cloud"];
    // 현재 사용중인 용량
    const { usedStorage, fetchStorage } = useStorage();
    // 할당된 용량
    const capacity = "0";

    return (
            <div id="navi">
                <div id="navi_top">
                    <div className="navi_active_btn"></div>
                    <h2 className="naviTit">{menuTitName}</h2>
                    {menuList.map((name, index) => (
                        <p
                            key={index}
                            // activeIndex가 현재 index와 같으면 'on' 클래스 추가
                            className={`menu ${activeIndex === index ? 'on' : ''}`}
                            // 클릭 시 해당 index로 상태 업데이트
                            onClick={() => setActiveIndex(index)}
                        >
                            {name}
                        </p>
                    ))}
                </div>
                <div id="navi_bottom" className="storage_use">
                    <div id="storage_use_text"><span id='now_storage_use'>{usedStorage} GB</span> / {capacity} GB</div>
                    <div id="storage_use_gaze_bac">
                        <div id='storage_use_gaze'></div>
                    </div>
                </div>
            </div>
    );
}