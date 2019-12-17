import { Aurum, DataSource, Switch, FilteredArrayView, ArrayDataSource } from 'aurumjs';

export interface ContentListProps {
	baseUrl?: string;
	flat?: boolean;
	initialFilter?: string;
	content: Category[];
}

export interface Category {
	name: string;
	sections: ContentSection[];
}

export interface ContentSection {
	name: string;
	prefix?: string;
	href: string;
}

interface ObservableCategory {
	name: string;
	sections: FilteredArrayView<ContentSection>;
}

export function ContentList(props: ContentListProps) {
	const inputSource = new DataSource(props.initialFilter ?? '');
	const visibleCategories: FilteredArrayView<ObservableCategory> = new ArrayDataSource(
		props.content.map((p) => ({
			name: p.name,
			sections: new FilteredArrayView(p.sections)
		}))
	).filter(() => true);

	inputSource.listen((value) => {
		visibleCategories.updateFilter((e) => !!e.sections.updateFilter((s) => s.name.toLowerCase().includes(value.toLowerCase())));
	});

	return (
		<header style="flex:0 0 350px;">
			<div class="sidenav sidenav-fixed" style="width:350px">
				<input maxLength="20" style="padding-left:10px" placeholder="Search..." inputValueSource={inputSource}></input>
				<Switch state={visibleCategories.length.debounce(0)}>
					<template ref={0} generator={() => <div>No results for {inputSource}</div>}></template>
					<template
						generator={() => (
							<ul>
								{visibleCategories.map((category: ObservableCategory) => (
									<li>{props.flat ? renderFlatCategory(category, props.baseUrl) : renderCategory(category, props.baseUrl)}</li>
								))}
							</ul>
						)}
					></template>
				</Switch>
			</div>
		</header>
	);
}

function renderFlatCategory(category: ObservableCategory, baseUrl: string = '') {
	return (
		<div>
			<ul style="list-style:none">
				{category.sections.map((section: ContentSection) => (
					<li>
						<a href={baseUrl + section.href}>
							{section.prefix}
							{section.name}
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}
function renderCategory(category: ObservableCategory, baseUrl: string = '') {
	return (
		<div>
			<h6 style="margin-left:30px; font-weight:bold;">{category.name}</h6>
			<ol style="list-style:none">
				{category.sections.map((section: ContentSection) => (
					<li>
						<a href={baseUrl + section.href}>
							{section.prefix}
							{section.name}
						</a>
					</li>
				))}
			</ol>
		</div>
	);
}
