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
				name: 'Quickstart'
			},
			{
				prefix: '2. ',
				href: 'coreideas',
				name: 'Core ideas'
			},
			{
				prefix: '3. ',
				href: 'why',
				name: 'Why Aurum'
			},
			{
				prefix: '4. ',
				href: 'examples',
				name: 'Examples'
			}
		]
	},
	{
		name: 'JSX',
		sections: [
			{
				prefix: '1. ',
				href: 'syntax',
				name: 'Syntax'
			},
			{
				prefix: '2. ',
				href: 'typescript',
				name: 'Typescript'
			},
			{
				prefix: '3. ',
				href: 'babel',
				name: 'Babel'
			}
		]
	},
	{
		name: 'State management',
		sections: [
			{
				prefix: '1. ',
				href: 'datasource',
				name: 'DataSource'
			},
			{
				prefix: '2. ',
				href: 'arraydatasource',
				name: 'ArrayDataSource'
			},
			{
				prefix: '3. ',
				href: 'objectdatasource',
				name: 'ObjectDataSource'
			}
		]
	},
	{
		name: 'Components',
		sections: [
			{
				prefix: '1. ',
				href: 'functional',
				name: 'Functional'
			},
			{
				prefix: '2. ',
				href: 'classes',
				name: 'Class based'
			},
			{
				prefix: '3. ',
				href: 'transclude',
				name: 'Transclusion'
			},
			{
				prefix: '4. ',
				href: 'react',
				name: 'Compatibility with react'
			},
			{
				prefix: '5. ',
				href: 'angular',
				name: 'Compatibility with angular'
			}
		]
	},
	{
		name: 'Control flow',
		sections: [
			{
				prefix: '1. ',
				href: 'switches',
				name: 'Branching in HTML'
			},
			{
				prefix: '2. ',
				href: 'suspense',
				name: 'Suspense'
			}
		]
	}
];

export function GettingStarted() {
	return (
		<div style="display:flex">
			<ContentList baseUrl="#/getting_started/" content={courses}></ContentList>
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
