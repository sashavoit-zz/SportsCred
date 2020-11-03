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
                {/* <blockquote class="reddit-card" >
      <a href="https://www.reddit.com/r/AskReddit/comments/jn5wfc/the_average_human_brain_is_comparable_to_about_25/?ref_source=embed&amp;ref=share">The Average human brain is comparable to about 2.5 million gigabites. Your brain has reached near capacity. What do you delete to free up space?</a> from
      <a href="https://www.reddit.com/r/AskReddit/">AskReddit</a>
    </blockquote> */}
            </div>
        )
    }
}
export default RedditEmbeds