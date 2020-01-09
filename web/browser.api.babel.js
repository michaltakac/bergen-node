import React from "react";

export default pluginOptions => ({
  Root: PreviousRoot => ({ children }) => {
    console.log("code is there")
    const fbergMath1SerieAuth = localStorage.getItem("fbergMath1SerieAuth");
    const auth = JSON.parse(fbergMath1SerieAuth);

    const scriptUrl = `https://www.googletagmanager.com/gtag/js?id=UA-39924303-4`;
    const gTag = `
      window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;

      ga('send', 'pageview');
      ga('create', {
        trackingId: 'UA-39924303-4',
        cookieDomain: 'auto',
        name: 'matematikai-serie',
        userId: '${(auth && auth.uid) || "undefined-user"}'
      });
	  `;
    return (
      <PreviousRoot>
        {children}
        <React.Fragment>
          <script async src={scriptUrl} />
          <script dangerouslySetInnerHTML={{ __html: gTag }} />
        </React.Fragment>
      </PreviousRoot>
    );
  }
});
