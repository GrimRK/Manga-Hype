import React from "react";
import ReactDOM from "react-dom"
import LatestUpdates from "../components/LatestUpdates";

it('render without crashing',()=>{
    const div=document.createElement("div");
    ReactDOM.render(<LatestUpdates/>,div);
    ReactDOM.unmountComponentAtNode(div);
});
