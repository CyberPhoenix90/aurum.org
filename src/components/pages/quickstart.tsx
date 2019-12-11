import { Aurum, AurumElement, Suspense } from 'aurumjs';
import { markdown } from 'markdown';

export function QuickStart(): AurumElement {
	return (
		<div class="page">
			<h2>Quickstart</h2>
			<br></br>
			<div>
				<Suspense
					loader={() =>
						fetch('/documentation/quickstart.md')
							.then((s) => s.text())
							.then((result) => <Markdown>{result}</Markdown>)
					}
				>
					Loading...
				</Suspense>
			</div>
		</div>
	);
}

function Markdown(_, children): AurumElement {
	return (
		<div
			onAttach={(element) => {
				element.node.innerHTML = markdown.toHTML(children[0]).replace(/code>/g, 'pre>');
			}}
		></div>
	);
}
