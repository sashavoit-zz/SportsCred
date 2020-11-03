import React from 'react'

export class RedditEmbeds extends React.Component{
    constructor(props){
        super(props);
        this.state={
            "embedHtml":""
        }
    }
    componentDidMount(){
        const requestOption = {
            mode:"cors",
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "origin":""
            }
        }
        const address = "https://cors-anywhere.herokuapp.com/https://www.reddit.com/oembed?url="+this.props.url;
        fetch(address, requestOption)
            .then(response => response.json())
            .then(data => {this.setState({embedHtml:data.html})})
            .catch(err => console.log(err))
    }
    render(){
        const {url} = this.props.url
        return(
            <div dangerouslySetInnerHTML={{__html: this.state.embedHtml}}></div>
        );
    }
}
export default RedditEmbeds