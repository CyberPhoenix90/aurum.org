import { Aurum, AurumElement, CancellationToken, DataSource } from 'aurumjs';
declare const Babel: any;
declare const r: any;

export interface ExampleModel {
	title: string;
	description: string;
	code: DataSource<string>;
}

const exampleData: ExampleModel[] = [
	{
		title: 'Hello world',
		description: `Basic Hello world example`,
		code: new DataSource(`return function() {
	return <div>Hello world</div>
}`)
	},
	{
		title: 'Rendering lists',
		description: `List of items synchronized to the data`,
		code: new DataSource(`import { ArrayDataSource } from 'aurumjs'
const items = new ArrayDataSource(['item one', 'item two'])

return function() {
	return <div>{items.map(i => <p>{i}</p>)}
	<button onClick={() => items.push('More')}>Add more</button>
	</div>
}`)
	},
	{
		title: 'Simple timer',
		description: `Updates every second to show how many seconds passed since the execution began`,
		code: new DataSource(`import { DataSource } from 'aurumjs'

return function() {
const seconds = new DataSource(0);

	setInterval(() => {
		seconds.update(seconds.value+1);
	},1000)

	return <div>{seconds}</div>
}`)
	},
	{
		title: 'Conditional rendering',
		description: 'Using data sources to render different branches conditionally',
		code: new DataSource(`import { DataSource } from 'aurumjs'

return function() {
const tabContent = new DataSource(<span>hello Tab 1</span>);

	return (<div>
		<button onClick={() => tabContent.update(<span>hello Tab 1</span>)}>Tab 1</button>
		<button onClick={() => tabContent.update(<span>hello Tab 2</span>)}>Tab 2</button>
		<button onClick={() => tabContent.update(<span>hello Tab 3</span>)}>Tab 3</button>
		{tabContent}
		</div>)
}`)
	},
	{
		title: 'Binding promises',
		description: 'Aurum is quite liberal with what you can bind to HTML. This is what happens when you bind promises',
		code: new DataSource(`import { DataSource } from 'aurumjs'

function sleep(time) {
	return new Promise((resolve) => {
		setTimeout(resolve,time);
	})
}

async function AsyncComponent({delay}){
	await sleep(delay);
	return <div>I'm ready</div>
}

return function() {
	const content = new DataSource([
		<AsyncComponent delay={1000}></AsyncComponent>,
		<AsyncComponent delay={2000}></AsyncComponent>,
		<AsyncComponent delay={3000}></AsyncComponent>,
		<AsyncComponent delay={4000}></AsyncComponent>,
		<AsyncComponent delay={5000}></AsyncComponent>
	]);

	return (<div>
		{content}
		<button onClick={() => content.update([
			<AsyncComponent delay={1000}></AsyncComponent>,
			<AsyncComponent delay={2000}></AsyncComponent>,
			<AsyncComponent delay={3000}></AsyncComponent>,
			<AsyncComponent delay={4000}></AsyncComponent>,
			<AsyncComponent delay={5000}></AsyncComponent>
		])}>Replay</button>
		</div>)
}`)
	},
	{
		title: 'TODO App',
		description: `Features:
		Double click to edit.
		Drag and drop of items with mouse.
		Enter to add a new item.
		Delete items.
		Filter by done.
		Mark as done.`,
		code: new DataSource(`import { DataSource, ArrayDataSource, Switch, SwitchCase, DefaultSwitchCase } from 'aurumjs'

return function Todo() {
	const todoSource = new ArrayDataSource();
	const filteredView = todoSource.filter(() => true);
	const editing = new DataSource();
	let id = 0;
	let draggedNode;

	return (
		<div>
			<div>
				<input onKeyDown={(e) => {
						if (e.keyCode === 13 && e.target.value) {
							todoSource.push({id: (id++).toString(), done: new DataSource(false), text: new DataSource(e.target.value)});
							e.target.value = '';
						}
					}}
					placeholder="What needs to be done?"
				></input>
			</div>
			<ul>
				{filteredView.map((model) => {
						let item;
						return (
							<li
								onAttach={(i) => {
									item = i;
									item.model = model;
								}}
								draggable="true"
								onDragStart={() => (draggedNode = item)}
								onDragEnter={(e) => {
									if (draggedNode.node.parentElement === item.node.parentElement) {
										todoSource.swapItems(item.model, draggedNode.model);
									}
								}}
								style={model.done.map((done) => (done ? 'color: red;text-decoration: line-through;display: flex;justify-content: space-between;' : 'display: flex;justify-content: space-between;'))}
							>
								<Switch state={editing}>
									<SwitchCase
										when={model.id}>
										<input
										onBlur={() => editing.update(undefined)}
										onAttach={(input) => input.node.focus()}
										initialValue={model.text.value}
										onKeyDown={(e) => {
											if (e.keyCode === 13) {
												model.text.update(e.target.value);
												editing.update(undefined);
											} else if (e.keyCode === 27) {
												editing.update(undefined);
											}
										}}
										/>
									</SwitchCase>
									<DefaultSwitchCase>
										<div onDblClick={(e) => editing.update(model.id)}>{model.text}</div>
									</DefaultSwitchCase>
								</Switch>
								<span>
									<button onClick={() => model.done.update(!model.done.value)}>
										{model.done.map((done) => (done ? 'Mark as not done' : 'Mark as done'))}
									</button>
									<button onClick={() => {
											if (editing.value === model.id) {
												editing.update(undefined);
											}
											todoSource.remove(model);
										}}>X</button>
								</span>
							</li>
						);
					})}
			</ul>
			<button onClick={() => filteredView.updateFilter(() => true)}>All</button>
			<button onClick={() => filteredView.updateFilter((todo) => todo.done.value)}>Done only</button>
			<button onClick={() => filteredView.updateFilter((todo) => !todo.done.value)}>Not done only</button>
		</div>
	);
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
		<div class="section">
			<div class="row">
				<ul>
					{exampleData.map((data: ExampleModel) => (
						<li class="row">
							<div class="col s12 m3">
								<h5>{data.title}</h5>
								<div>{data.description}</div>
							</div>
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
					))}
				</ul>
			</div>
		</div>
	);
}
