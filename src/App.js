import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSlugFromUrl } from '@utils/utils';
import { router } from '@utils/router';
import Page from '@pages/page';
import { Toaster } from 'react-hot-toast';

function App() {
	const [slug, setSlug] = useState(getSlugFromUrl(window.location.href));

	function renderPageContent(slug) {
		return router[slug]?.pageContent ?? 'error happened!!';
	}

	useEffect(() => {
		const wrapper = document.getElementById('toplevel_page_trigger');
		if (wrapper) {
			wrapper.addEventListener('click', (event) => {
				event.preventDefault();
				const liItems = wrapper.querySelectorAll('li');
				liItems.forEach((item) => item.classList.remove('current'));
				const closestLinkTag = event.target.closest('a');
				if (closestLinkTag) {
					const url = triggerObject.admin_url + closestLinkTag.getAttribute('href');
					const newSlug = getSlugFromUrl(url);
					setSlug(newSlug);
					window.history.pushState({}, '', url);
					closestLinkTag.closest('li').classList.add('current');
				}
			});
		}
	});

	return (
		<>
			<Page>{renderPageContent(slug)}</Page>
			<Toaster position='bottom-right' />
		</>
	);
}

export default App;
