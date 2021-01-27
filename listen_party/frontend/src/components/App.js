import React, { Component } from "react"; 
import { render } from "react-dom";
import "./app.css"; 
import HomePage from "./HomePage"
import Footer from "./Footer"; 
import { ThemeProvider } from "@material-ui/core/styles"; 
import theme from "./theme"; 


export default class App extends Component { 
    constructor(props) { 
        super(props); 
    }
    render() { 
        return (
            <ThemeProvider theme={theme}>
                <div className="mainContainer">
                    <div className="center">
                        <HomePage /> 
                    </div>
                </div>
                <Footer/>
            </ThemeProvider>
        ); 
    }
}

// saving html element that will hold the react app 
const appDiv = document.getElementById("app"); 
//rendering the App component created above inside the selected appDiv element
render(<App />, appDiv); 
