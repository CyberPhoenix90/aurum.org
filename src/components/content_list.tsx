import { ArrayDataSource, Aurum, DataSource, DefaultSwitchCase, FilteredArrayView, Switch, SwitchCase } from 'aurumjs';

export interface ContentListProps {
	selectedNode?: DataSource<string>;
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
	id: string;
	name: string;
	prefix?: string;
	href: string;
}

interface ObservableCategory {
	name: string;
	sections: FilteredArrayView<ContentSection>;
}

export function ContentList(props: ContentListProps) {
	props.selectedNode = props.selectedNode ?? new DataSource();
	const inputSource = new DataSource(props.initialFilter ?? '');
	const visibleCategories: FilteredArrayView<ObservableCategory> = new ArrayDataSource(
		props.content.map((p) => ({
			name: p.name,
			sections: new FilteredArrayView(p.sections).persist()
		}))
	)
		.filter(() => true)
		.persist();

	inputSource.listen((value) => {
		visibleCategories.updateFilter((e) => !!e.sections.updateFilter((s) => s.name.toLowerCase().includes(value.toLowerCase())));
	});

	return (
		<header class="content-list">
			<div class="sidenav sidenav-fixed content-list" style="width:350px">
				<input maxLength="20" placeholder="Search..." value={inputSource}></input>
				<Switch state={visibleCategories.length.debounce(0)}>
					<SwitchCase when={0}>
						<div>No results for {inputSource}</div>
					</SwitchCase>
					<DefaultSwitchCase>
						<ul>
							{visibleCategories.map((category: ObservableCategory) => (
								<li>
									{props.flat
										? renderFlatCategory(category, props.baseUrl, props.selectedNode)
										: renderCategory(category, props.baseUrl, props.selectedNode)}
								</li>
							))}
						</ul>
					</DefaultSwitchCase>
				</Switch>
			</div>
		</header>
	);
}

function renderFlatCategory(category: ObservableCategory, baseUrl: string = '', selectedNode: DataSource<string>) {
	return (
		<div>
			<ul style="list-style:none">
				{category.sections.map((section: ContentSection) => (
					<li>
						<a
							onClick={() => selectedNode.update(section.id)}
							class={selectedNode.map<string>((v) => (v === section.id ? 'selected' : ''))}
							href={baseUrl + section.href}
						>
							{section.prefix}
							{section.name}
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}
function renderCategory(category: ObservableCategory, baseUrl: string = '', selectedNode: DataSource<string>) {
	return (
		<div>
			<h6 style="margin-left:30px; font-weight:bold;">{category.name}</h6>
			<ol style="list-style:none">
				{category.sections.map((section: ContentSection) => (
					<li>
						<a
							onClick={() => selectedNode.update(section.id)}
							class={selectedNode.map<string>((v) => (v === section.id ? 'selected' : ''))}
							href={baseUrl + section.href}
						>
							{section.prefix}
							{section.name}
						</a>
					</li>
				))}
			</ol>
		</div>
	);
}
