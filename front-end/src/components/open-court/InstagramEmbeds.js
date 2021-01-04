import React from 'react'

export class InstagramEmbeds extends React.Component{
    constructor(props){
        super(props);
        this.state={
            "embedHtml":""
        }
    }
    componentDidMount(){
        const requestOption={
            mode:"cors",
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "orgin":""
            }
        }
        const address =  "https://cors-anywhere.herokuapp.com/https://graph.facebook.com/v8.0/instagram_oembed?url="+this.props.url+"&access_token=662939964420696|80a00ba3156766f2ecaa4eb4dcff1f18";
        fetch(address, requestOption)
            .then(rep =>rep.json())
            .then(data =>{this.setState({embedHtml:data.html})})
            .catch(err => console.log("ins error"+ err))
        
    }
    render(){
        return(
            <div>
            <div dangerouslySetInnerHTML={{__html: this.state.embedHtml}} />
            </div>
        )
    }
}
export default InstagramEmbeds
