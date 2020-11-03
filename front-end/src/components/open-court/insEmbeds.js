import React from 'react'

export class InsEmbeds extends React.Component{
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
        const address =  "https://graph.facebook.com/v8.0/instagram_oembed?url="+this.props.url+"&access_token=662939964420696|80a00ba3156766f2ecaa4eb4dcff1f18";
        fetch(address, requestOption)
            .then(rep =>rep.json())
            .then(data =>{this.setState({embedHtml:data.html})})
            .catch(err => console.log("ins error"+ err))
        
    }
    render(){
        return(
            <div dangerouslySetInnerHTML={{__html: this.state.embedHtml}} />
        )
    }
}
export default InsEmbeds