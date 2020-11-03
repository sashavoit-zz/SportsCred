import React from 'react';

export class TwitterEmbeds extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            embedHtml:""
        }
    }
    componentDidMount(){
        const script = document.createElement("script");
    
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        script.charset = "utf-8";
    
        document.body.appendChild(script);
        const requestOptions = {
            mode:"cors",
            method: "GET",
            // body: JSON.stringify({
            //     url:this.props.url
            // }),
            headers: {
                "Content-Type": "application/json",
                "origin":"",
            },
        };
        const address = "https://cors-anywhere.herokuapp.com/https://publish.twitter.com/oembed?url="+this.props.url;
        fetch(address, requestOptions)
            .then(response => response.json())
            .then(data => {this.setState({embedHtml:data.html})})
            .catch(err => console.log(err))

    }
    render(){
        return(
            <div id="wrapper">
                <div dangerouslySetInnerHTML={{__html: this.state.embedHtml}}></div>
             
            </div>
        )
    }
}
export default TwitterEmbeds