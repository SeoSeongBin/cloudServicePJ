import React, { useState } from 'react';

export default function Navi() {
    const menuTitName = "Menu List"
    const [activeIndex, setActiveIndex] = useState(0);
    const menuList = ["My Cloude", "Graph"];

    return (
            <div id="navi">
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
    );
}