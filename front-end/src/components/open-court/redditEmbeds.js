import React from 'react';

export class RedditEmbeds extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            embedHtml:""
        }
    }
    componentDidMount(){
        const script = document.createElement("script");
    
        script.src = "https://embed.redditmedia.com/widgets/platform.js";
        script.async = true;
        script.charset="UTF-8";
        document.body.appendChild(script);
        const requestOptions = {
            mode:"cors",
            method: "GET",
           
            headers: {
                "Content-Type": "application/json",
                "origin":"",
            },
        };
        const address = "https://cors-anywhere.herokuapp.com/https://www.reddit.com/oembed?url="+this.props.url;
        fetch(address, requestOptions)
            .then(response => response.json())
            .then(data => {this.setState({embedHtml:data.html})})
            .catch(err => console.log(err))

    }
    render(){
        return(
            <div>
                <div dangerouslySetInnerHTML={{__html: this.state.embedHtml}}></div>
            </div>
        )
    }
}
export default RedditEmbeds