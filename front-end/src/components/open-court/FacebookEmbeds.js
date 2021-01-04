import React from 'react';

export class FacebookEmbeds extends React.Component{
    componentDidMount () {
        const script = document.createElement("script");
        script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }
    render(){
        const {url} = this.props;
        return(
            <div id="facebook"
                class="fb-post" 
                data-href={url}
                data-width="500"
                target="_top"
                >
            </div>
        )
    }
}
export default FacebookEmbeds