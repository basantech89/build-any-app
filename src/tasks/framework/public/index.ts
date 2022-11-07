import { writeObjToRoot, writeToRoot } from '../../../utils/index'
import { StaticContent } from '../static-content'

import { copyToRoot } from '../../../utils/index'

import path from 'path'

function createPublicDir(this: StaticContent) {
	writeToRoot(
		'public/index.html',
		`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          <meta name="description" content="Web site created using create-app" />
          <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
          <!--
            manifest.json provides metadata used when your web app is installed on a
            user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
          -->
          <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
          <!--
            Notice the use of %PUBLIC_URL% in the tags above.
            It will be replaced with the URL of the \`public\` folder during the build.
            Only files inside the \`public\` folder can be referenced from the HTML.

            Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
            work correctly both with client-side routing and a non-root public URL.
            Learn how to configure a non-root public URL by running \`npm run build\`.
          -->
          <title>Create App</title>
        </head>
        <body>
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <div id="root"></div>
          <!--
            This HTML file is a template.
            If you open it directly in the browser, you will see an empty page.

            You can add webfonts, meta tags, or analytics to this file.
            The build step will place the bundled scripts into the <body> tag.

            To begin the development, run \`npm start\` or \`yarn start\`.
            To create a production bundle, use \`npm run build\` or \`yarn build\`.
          -->
        </body>
      </html>
    `
	)

	writeObjToRoot('public/manifest.json', {
		short_name: 'Create App',
		name: 'Create App',
		icons: [
			{
				src: 'favicon.ico',
				sizes: '64x64 32x32 24x24 16x16',
				type: 'image/x-icon',
			},
			{
				src: 'logo192.png',
				type: 'image/png',
				sizes: '192x192',
			},
			{
				src: 'logo512.png',
				type: 'image/png',
				sizes: '512x512',
			},
		],
		start_url: '.',
		display: 'standalone',
		theme_color: '#000000',
		background_color: '#ffffff',
	})

	writeToRoot(
		'public/robots.txt',
		`
      # https://www.robotstxt.org/robotstxt.html
      User-agent: *
      Disallow:
    `
	)

	copyToRoot(path.join(__dirname, './favicon.ico'), 'public/favicon.ico')
	copyToRoot(path.join(__dirname, './logo192.png'), 'public/logo192.png')
	copyToRoot(path.join(__dirname, './logo512.png'), 'public/logo512.png')

	return this
}

export default createPublicDir
