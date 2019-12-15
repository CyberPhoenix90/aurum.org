import { Aurum, ArrayDataSource, DataSource, FilteredArrayView, Switch, AurumRouter, Custom } from 'aurumjs';
import { DocumentationPage } from './documentation_page';

export interface Course {
	name: string;
	sections: FilteredArrayView<CourseSection>;
}

export interface CourseSection {
	name: string;
	prefix: string;
	href: string;
}

const courses = new ArrayDataSource<Course>([
	{
		name: 'Aurum.js',
		sections: new FilteredArrayView<CourseSection>([
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
				href: 'benchmarks',
				name: 'Benchmarks'
			},
			{
				prefix: '4. ',
				href: 'examples',
				name: 'Examples'
			}
		])
	},
	{
		name: 'JSX',
		sections: new FilteredArrayView<CourseSection>([
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
		])
	},
	{
		name: 'Data management',
		sections: new FilteredArrayView([
			{
				prefix: '1. ',
				href: 'coreconcept',
				name: 'Core concept'
			},
			{
				prefix: '2. ',
				href: 'datasource',
				name: 'DataSource'
			},
			{
				prefix: '3. ',
				href: 'arraydatasource',
				name: 'ArrayDataSource'
			},
			{
				prefix: '4. ',
				href: 'objectdatasource',
				name: 'ObjectDataSource'
			}
		])
	},
	{
		name: 'Components',
		sections: new FilteredArrayView([
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
				href: 'react',
				name: 'Compatibility with react'
			},
			{
				prefix: '4. ',
				href: 'angular',
				name: 'Compatibility with angular'
			}
		])
	},
	{
		name: 'Control flow',
		sections: new FilteredArrayView([
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
		])
	}
]);

export function GettingStarted() {
	const inputSource = new DataSource('');
	const visibleCourses: FilteredArrayView<Course> = courses.filter(() => true);
	inputSource.listen((value) => {
		visibleCourses.updateFilter((e) => !!e.sections.updateFilter((s) => s.name.toLowerCase().includes(value.toLowerCase())));
	});

	return (
		<div style="display:flex">
			<header style="flex:0 0 350px;">
				<div class="sidenav sidenav-fixed" style="width:350px">
					<input maxLength="20" style="padding-left:10px" placeholder="Search..." inputValueSource={inputSource}></input>
					<Switch state={visibleCourses.length.debounce(0)}>
						<template ref={0} generator={() => <div>No results for {inputSource}</div>}></template>
						<template
							generator={() => (
								<ul repeatModel={visibleCourses}>
									<template
										generator={(course: Course) => (
											<li>
												<h6 style="margin-left:30px; font-weight:bold;">{course.name}</h6>
												<ol style="list-style:none" repeatModel={course.sections}>
													<template
														generator={(section: CourseSection) => (
															<li>
																<a href={'#/getting_started/' + section.href}>
																	{section.prefix}
																	{section.name}
																</a>
															</li>
														)}
													></template>
												</ol>
											</li>
										)}
									></template>
								</ul>
							)}
						></template>
					</Switch>
				</div>
			</header>
			<div class="container" style="width:100%">
				<div class="row">
					<div class="col s12 m8 xl7">
						<AurumRouter>
							<template
								ref="/getting_started/coreideas"
								generator={() => <DocumentationPage title="Core ideas" url="/documentation/core_ideas.md"></DocumentationPage>}
							></template>
							<template generator={() => <DocumentationPage title="" url="/documentation/quickstart.md"></DocumentationPage>}></template>
						</AurumRouter>
					</div>
				</div>
			</div>
		</div>
	);
}
