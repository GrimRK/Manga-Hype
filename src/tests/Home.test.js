import { Home } from "@mui/icons-material";
import React from "react";
import ReactDOM from "react-dom"

it('render without crashing',()=>{
    const div=document.createElement("div");
    ReactDOM.render(<Home/>,div);
    ReactDOM.unmountComponentAtNode(div);
});
