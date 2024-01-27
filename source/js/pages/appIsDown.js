"use strict";

export const TITLE = "App Is Down";

export default function content(){
	return `
		<container class="p-5">
			<column class="w-50 surface-clean p-5">
				<x-svg name="${window.CONF["default"]["appIsDown"]["icon"]}"></x-svg>
				<h1>${window.CONF["default"]["appIsDown"]["title"]}</h1>
				<h3 class="text-color-secondary">${window.CONF["default"]["appIsDown"]["explanation"]}</h3>
			</column>
		</container>
	`;
}
