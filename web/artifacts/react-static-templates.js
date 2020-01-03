

import React from 'react'
import universal, { setHasBabelPlugin } from '/Users/michaltakac/Projects/matematika/bergen-node/web/node_modules/react-universal-component/dist/index.js'

setHasBabelPlugin()

const universalOptions = {
  loading: () => null,
  error: props => {
    console.error(props.error);
    return <div>An error occurred loading this page's template. More information is available in the console.</div>;
  },
  ignoreBabelRename: true
}

const t_0 = universal(import('/Users/michaltakac/Projects/matematika/bergen-node/web/node_modules/react-static/lib/browser/components/Default404'), universalOptions)
      t_0.template = '/Users/michaltakac/Projects/matematika/bergen-node/web/node_modules/react-static/lib/browser/components/Default404'
      

// Template Map
export default {
  '/Users/michaltakac/Projects/matematika/bergen-node/web/node_modules/react-static/lib/browser/components/Default404': t_0
}
// Not Found Template
export const notFoundTemplate = "/Users/michaltakac/Projects/matematika/bergen-node/web/node_modules/react-static/lib/browser/components/Default404"

