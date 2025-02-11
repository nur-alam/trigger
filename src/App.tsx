import config from '@config';
import { router } from '@utils/router'
import { getSlugFromUrl } from '@utils/utils';
import React, { use, useEffect, useState } from 'react'

function Page({ children }: { children: React.ReactNode }) {
	return <>{children}</>
}

const App = () => {

	const [slug, setSlug] = useState(getSlugFromUrl(window.location.href) ?? 'trigger');

	function renderPageContent(slug: string) {
		return router[slug]?.pageContent ?? 'Page not found';
	}

	useEffect(() => {
		const wrapper = document.getElementById('toplevel_page_trigger') as HTMLElement;
		if (wrapper) {
			wrapper.addEventListener('click', (event) => {
				event.preventDefault();
				const liItems = wrapper.querySelectorAll('li');
				liItems.forEach((li) => {
					li.classList.remove('current');
				});
				const target = event.target as HTMLElement;
				const closestLinkTag = target?.closest('a') as HTMLAnchorElement;
				if (closestLinkTag) {
					const url = config.admin_url + closestLinkTag.getAttribute('href');
					const newSlug = getSlugFromUrl(url);
					// console.log('newSlug', newSlug);

					if (newSlug) {
						setSlug(newSlug);
					}
					window.history.pushState({}, '', url);
					closestLinkTag.closest('li')?.classList.add('current');
				}
			});
		}
	});


	return (
		<>
			<Page>{renderPageContent(slug)}</Page>
		</>
	)
}

export default App