import React, {useEffect, useState} from "react";
import Navi from './NaviTemp';
import Header from './Header';
import Content from './MainContent';

function Main() {
    
    return (
        <div>
            <Header />
            <Navi />
            <Content />
        </div>
    );

}

export default Main;