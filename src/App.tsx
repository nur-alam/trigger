import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSlugFromUrl } from '@utils/utils';
import { router } from '@utils/router';
import Page from '@pages/page';
import config from '@config/index';
import { Toaster } from 'react-hot-toast';

function App() {
	const [slug, setSlug] = useState(getSlugFromUrl(window.location.href));

	function renderPageContent(slug: string) {
		return router[slug]?.pageContent ?? 'error happened!!';
	}

	useEffect(() => {
		const wrapper = document.getElementById('toplevel_page_trigger');
		if (wrapper) {
			wrapper.addEventListener('click', (event: MouseEvent) => {
				event.preventDefault();
				const liItems = wrapper.querySelectorAll('li');
				liItems.forEach((item) => item.classList.remove('current'));
				const closestLinkTag = (event.target as HTMLElement).closest('a');
				if (closestLinkTag) {
					const url = config.admin_url + closestLinkTag.getAttribute('href');
					const newSlug = getSlugFromUrl(url);
					setSlug(newSlug);
					window.history.pushState({}, '', url);
					closestLinkTag.closest('li')?.classList.add('current');
				}
			});
		}
	});
	return (
		<>
			<Page>{renderPageContent(slug)}</Page>
			<Toaster
				position="bottom-right"
				// position="bottom-center"
				containerClassName="!z-[9999999]"
				toastOptions={{
					duration: 5000,
					style: {
						background: '#fff',
						color: '#333',
						border: '1px solid #e5e7eb',
						padding: '16px',
						borderRadius: '8px',
						boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
					},
					success: {
						style: {
							background: '#f0fdf4',
							borderColor: '#86efac',
						},
					},
					error: {
						style: {
							background: '#fef2f2',
							borderColor: '#fecaca',
						},
					},
				}}
			/>
		</>
	);
}

export default App;
