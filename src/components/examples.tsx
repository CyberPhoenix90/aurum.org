import { Aurum, DataSource, Template, AurumElement, CancellationToken } from 'aurumjs';
declare const Babel: any;
declare const r: any;

export interface ExampleModel {
	description: string;
	code: DataSource<string>;
}

const exampleData: ExampleModel[] = [
	{
		description: `Simple Timer. Updates every second to show how many seconds passed since the execution began`,
		code: new DataSource(`import {DataSource} from 'aurumjs'

return function() {
const seconds = new DataSource(0);

	setInterval(() => {
		seconds.update(seconds.value+1);
	},1000)

	return <div>{seconds}</div>
}`)
	}
];

function evaluate(dataSource: DataSource<string>, cancellationToken: CancellationToken) {
	let root: AurumElement;
	dataSource
		.unique()
		.debounce(1000)
		.listen((newCode) => {
			renderCode(newCode);
		}, cancellationToken);
	return (
		<div
			onAttach={(div) => {
				root = div;
				renderCode(dataSource.value);
			}}
		></div>
	);

	async function renderCode(newCode: string) {
		root.clearChildren();
		try {
			const aurumAll = await import('aurumjs');
			const code: string = Babel.transform('(() => {/** @jsx Aurum.Aurum.factory */	\n' + replaceImport(newCode) + '})()', {
				presets: ['es2015', 'react']
			}).code;
			root.addChild(new Function('Aurum', 'return ' + code.substring(code.indexOf('(')))(aurumAll)());
		} catch (e) {
			root.addChild(<pre>{e}</pre>);
		}
	}
}

function replaceImport(code: string): string {
	return code.replace(/import\s*{(.*?)}\s*from\s'aurumjs'/g, (substring: string, ...args: any[]) => {
		return `const {${args[0]}} = Aurum;`;
	});
}

export function Examples() {
	const token = new CancellationToken();
	return (
		<div class="container">
			<div class="section">
				<div class="row">
					<ul repeatModel={exampleData}>
						<Template
							generator={(data: ExampleModel) => (
								<li>
									<div class="col s12 m3">{data.description}</div>
									<div class="col s8 m6">
										<div
											style="height:300px;border:1px solid #ccc"
											onAttach={(d) => {
												r(['vs/editor/editor.main'], async function() {
													const text = await (await fetch('data/aurum.d.ts')).text();
													//@ts-ignore
													monaco.languages.typescript.javascriptDefaults.addExtraLib([text].join('\n'), 'aurum.d.ts');

													//@ts-ignore
													const editor = monaco.editor.create(d.node as HTMLDivElement, {
														value: data.code.value,
														minimap: {
															enabled: false
														},
														theme: 'vs-dark',
														lineNumbers: 'off',

														language: 'javascript'
													});
													editor.onKeyUp(() => data.code.update(editor.getValue()));
												});
											}}
										></div>
									</div>
									<div onDispose={() => token.cancel()} class="col s4 m3">
										<div>Result</div>
										{evaluate(data.code, token)}
									</div>
								</li>
							)}
						></Template>
					</ul>
				</div>
			</div>
		</div>
	);
}
