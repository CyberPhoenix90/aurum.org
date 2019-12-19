import { Aurum, ArrayDataSource, DataSource, FilteredArrayView, Switch, AurumRouter, Custom } from 'aurumjs';
import { MarkdownPage } from './markdown_page';
import { ExamplePage } from './example_page';
import { Category, ContentList } from '../content_list';

const courses: Category[] = [
	{
		name: 'Aurum.js',
		sections: [
			{
				prefix: '1. ',
				href: '',
				name: 'Quickstart',
				id: ''
			},
			{
				prefix: '2. ',
				href: 'coreideas',
				name: 'Core ideas',
				id: 'coreideas'
			},
			{
				prefix: '3. ',
				href: 'why',
				name: 'Why Aurum',
				id: 'why'
			},
			{
				prefix: '4. ',
				href: 'examples',
				name: 'Examples',
				id: 'examples'
			}
		]
	},
	{
		name: 'JSX',
		sections: [
			{
				prefix: '1. ',
				href: 'syntax',
				name: 'Syntax',
				id: 'syntax'
			},
			{
				prefix: '2. ',
				href: 'typescript',
				name: 'Typescript',
				id: 'typescript'
			},
			{
				prefix: '3. ',
				href: 'babel',
				name: 'Babel',
				id: 'babel'
			}
		]
	},
	{
		name: 'State management',
		sections: [
			{
				prefix: '1. ',
				href: 'datasource',
				name: 'DataSource',
				id: 'datasource'
			},
			{
				prefix: '2. ',
				href: 'arraydatasource',
				name: 'ArrayDataSource',
				id: 'arraydatasource'
			},
			{
				prefix: '3. ',
				href: 'objectdatasource',
				name: 'ObjectDataSource',
				id: 'objectdatasource'
			}
		]
	},
	{
		name: 'Components',
		sections: [
			{
				prefix: '1. ',
				href: 'functional',
				name: 'Functional',
				id: 'functional'
			},
			{
				prefix: '2. ',
				href: 'classes',
				name: 'Class based',
				id: 'classes'
			},
			{
				prefix: '3. ',
				href: 'transclude',
				name: 'Transclusion',
				id: 'transclude'
			}
		]
	},
	{
		name: 'Control flow',
		sections: [
			{
				prefix: '1. ',
				href: 'switches',
				name: 'Branching in HTML',
				id: 'switches'
			},
			{
				prefix: '2. ',
				href: 'suspense',
				name: 'Suspense',
				id: 'suspense'
			}
		]
	}
];

export function GettingStarted() {
	const selectedNode = new DataSource<string>(getSelectedPage());
	window.addEventListener('hashchange', () => {
		selectedNode.update(getSelectedPage());
	});

	return (
		<div style="display:flex">
			<ContentList selectedNode={selectedNode} baseUrl="#/getting_started/" content={courses}></ContentList>
			<div class="container" style="width:100%">
				<div class="row">
					<div class="col s12 m12 xl12">
						<AurumRouter>
							<template
								ref="/getting_started/coreideas"
								generator={() => <MarkdownPage title="Core ideas" url="/documentation/core_ideas.md"></MarkdownPage>}
							></template>
							<template
								ref="/getting_started/why"
								generator={() => <MarkdownPage title="Why Aurum" url="/documentation/why.md"></MarkdownPage>}
							></template>
							<template
								ref="/getting_started/syntax"
								generator={() => <MarkdownPage title="Syntax" url="/documentation/syntax.md"></MarkdownPage>}
							></template>
							<template ref="/getting_started/examples" generator={() => <ExamplePage></ExamplePage>}></template>
							<template generator={() => <MarkdownPage title="Quickstart" url="/documentation/quickstart.md"></MarkdownPage>}></template>
						</AurumRouter>
					</div>
				</div>
			</div>
		</div>
	);
}

function getSelectedPage() {
	const hash = location.hash.substring(1);
	if (hash.startsWith('/getting_started/')) {
		return hash.substring('/getting_started/'.length);
	} else {
		return '';
	}
}
