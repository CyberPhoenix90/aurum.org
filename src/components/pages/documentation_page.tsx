import { Aurum, AurumElement, DataSource, Suspense } from 'aurumjs';
import { Category, ContentList } from '../content_list';

interface DocumentationNodeReference {
	type: 'reference';
	name: string;
	id: number;
}

interface DocumentationTypeNode {
	type: string;
	name?: string;
	declaration?: DocumentationNode;
	elementType: DocumentationNodeReference;
}

interface DocumentationNode {
	type?: DocumentationTypeNode | DocumentationNodeReference;
	flags?: {
		isOptional?: boolean;
	};
	name: string;
	kind: number;
	kindString: string;
	id: number;
	getSignature?: DocumentationNode[];
	signatures?: DocumentationNode[];
	typeParameter?: DocumentationNode[];
	parameters?: DocumentationNode[];
	extendedTypes?: DocumentationNodeReference[];
	inheritedFrom?: DocumentationNodeReference;
	comment?: {
		text?: string;
		shortText?: string;
		returns?: string;
		tags: { tag: string; text: string }[];
	};
	children: DocumentationNode[];
}

export type Markup = string | AurumElement | Array<string | AurumElement | Markup>;

export function DocumentationPage() {
	return (
		<Suspense fallback="Loading...">
			<Documentation></Documentation>
		</Suspense>
	);
}

async function Documentation() {
	const docsModel = await fetch('/node_modules/aurumjs/docs/docs.json').then((s) => s.json());
	const nodes: DocumentationNode[] = docsModel.children
		.flatMap((p) => {
			if (p.kind === 1) {
				return p.children;
			} else {
				return [p];
			}
		})
		.filter((p) => p && !isInternal(p))
		.sort((a, b) => a.name.localeCompare(b.name));

	const model: Category[] = nodes.map<Category>((p) => ({
		name: p.name,
		sections: [
			{
				href: p.name,
				id: p.id.toString(),
				name: getFullNodeName(p)
			}
		]
	}));

	const nodeIdMap: Map<number, DocumentationNode> = new Map();
	const nodeNameMap: Map<string, DocumentationNode> = new Map();

	for (const node of nodes) {
		nodeIdMap.set(node.id, node);
		nodeNameMap.set(node.name, node);
	}

	const pageContent = new DataSource(renderRootNode(getSelectedNode(nodeNameMap), nodeIdMap));
	const selectedNode = new DataSource<string>(getSelectedNode(nodeNameMap).id.toString());
	window.addEventListener('hashchange', () => {
		pageContent.update(renderRootNode(getSelectedNode(nodeNameMap), nodeIdMap));
		selectedNode.update(getSelectedNode(nodeNameMap).id.toString());
	});

	return (
		<div style="display:flex">
			<ContentList selectedNode={selectedNode} baseUrl="#/documentation/" flat={true} content={model}></ContentList>
			<div class="container" style="width:100%">
				<div class="row">
					<div class="col s12 m12 xl12">{pageContent}</div>
				</div>
			</div>
		</div>
	);
}

function linkFactory(nodeName: string): string {
	return '#/documentation/' + nodeName;
}

function getSelectedNode(nodes: Map<string, DocumentationNode>): DocumentationNode {
	const nodeName = location.href.substring(location.href.lastIndexOf('/') + 1);
	if (nodes.has(nodeName)) {
		return nodes.get(nodeName);
	} else {
		return nodes.get('Aurum');
	}
}

function renderRootNode(node: DocumentationNode, nodeById: Map<number, DocumentationNode>): AurumElement {
	if (!node) {
		return <div>No item selected</div>;
	}

	return (
		<div>
			<h3>
				{node.kindString} {renderNodeName(node, nodeById)}
			</h3>
			{(node?.type as DocumentationTypeNode)?.declaration?.signatures?.[0] && (
				<h5>Alias for: {getFullSignature((node.type as DocumentationTypeNode).declaration.signatures[0], nodeById)}</h5>
			)}
			<div>{renderJsDoc(node)}</div>
			<br></br>
			<div class="documentation-sections">
				{node.children?.map((c) => {
					switch (c.kind) {
						case 64:
						case 512:
						case 2048:
							return renderFunction(c, nodeById);
						case 1024:
							return renderProperty(c, nodeById);
						case 262144:
							return renderGetterAccessor(c, nodeById);
						default:
							return (
								<div>
									Unknown node kind {c.kind} {c.kindString}
								</div>
							);
					}
				})}
			</div>
		</div>
	);
}

function isInternal(node: DocumentationNode) {
	return !!node?.comment?.tags?.some((t) => t.tag === 'internal') || node.name.startsWith('__');
}

function renderMetadata(node: DocumentationNode): AurumElement {
	return (
		<summary>
			<details>
				<pre>{JSON.stringify(node, undefined, 4)}</pre>
			</details>
		</summary>
	);
}

function renderFunction(node: DocumentationNode, nodeById: Map<number, DocumentationNode>): AurumElement {
	return (
		<div>
			<h6>{getFullSignature(node.signatures[0], nodeById)}</h6>
			<div>{renderJsDoc(node.signatures[0])}</div>
		</div>
	);
}

function renderFunctionInline(node: DocumentationNode, nodeById: Map<number, DocumentationNode>): AurumElement {
	return <span>{getFullSignature(node.signatures[0], nodeById)}</span>;
}

function renderGetterAccessorInline(node: DocumentationNode, nodeById: Map<number, DocumentationNode>): AurumElement {
	return <span>get {getFullProperty(node, nodeById)}</span>;
}

function renderGetterAccessor(node: DocumentationNode, nodeById: Map<number, DocumentationNode>): AurumElement {
	return (
		<div>
			<h6>get {getFullProperty(node, nodeById)}</h6>
			<div>{renderJsDoc(node)}</div>
		</div>
	);
}

function renderPropertyInline(node: DocumentationNode, nodeById: Map<number, DocumentationNode>): AurumElement {
	return <span>{getFullProperty(node, nodeById)}</span>;
}

function renderProperty(node: DocumentationNode, nodeById: Map<number, DocumentationNode>): AurumElement {
	return (
		<div>
			<h6>{getFullProperty(node, nodeById)}</h6>
			<div>{renderJsDoc(node)}</div>
		</div>
	);
}

function renderJsDoc(node: DocumentationNode) {
	const clauses: AurumElement[] = [];

	if (!node.comment) {
		return null;
	}

	if (node.comment.shortText) {
		clauses.push(<div>{node.comment.shortText}</div>);
	}

	if (node.comment.text) {
		clauses.push(<div>{node.comment.text}</div>);
	}

	if (node.comment.returns) {
		clauses.push(
			<div>
				<em>returns:</em> {node.comment.returns}
			</div>
		);
	}

	return clauses;
}

function getFullProperty(node: DocumentationNode, nodeById: Map<number, DocumentationNode>): Markup {
	let property = node.name;

	if (node.type) {
		return [property + ': ', typeNodeToMarkup(node.type, nodeById)];
	}

	if (node.getSignature) {
		return [property + ': ', typeNodeToMarkup(node.getSignature[0].type, nodeById)];
	}

	return [property];
}

function renderNodeInline(node: DocumentationNode, nodeById: Map<number, DocumentationNode>): Markup {
	switch (node.kind) {
		case 64:
		case 512:
		case 2048:
			return renderFunctionInline(node, nodeById);
		case 1024:
			return renderPropertyInline(node, nodeById);
		case 262144:
			return renderGetterAccessorInline(node, nodeById);
		default:
			return (
				<div>
					Unknown node kind {node.kind} {node.kindString}
				</div>
			);
	}
}

function typeNodeToMarkup(node: DocumentationTypeNode | DocumentationNodeReference, nodeById: Map<number, DocumentationNode>): Markup {
	if (node.type === 'reflection') {
		const declaration = (node as DocumentationTypeNode).declaration;
		if (declaration.signatures) {
			return getFullSignature((node as DocumentationTypeNode).declaration.signatures[0], nodeById);
		} else {
			if (declaration.kind === 65536) {
				return ['{', declaration.children.map((p) => renderNodeInline(p, nodeById)), '}'];
			} else {
				return ['any'];
			}
		}
	} else if (node.type === 'typeParameter') {
		return [node.name];
	} else if (node.type === 'array') {
		return [typeNodeToMarkup((node as DocumentationTypeNode).elementType, nodeById), '[]'];
	} else if (node.type === 'reference') {
		return [<a href={linkFactory(node.name)}>{node.name}</a>];
	} else if (node.type === 'intrinsic') {
		return [node.name];
	} else {
		return ['any'];
	}
}

function getFullSignature(node: DocumentationNode, nodeById: Map<number, DocumentationNode>): Markup {
	let signature = [];
	if (node.name !== '__call' && node.name !== '__type') {
		signature.push(node.name);
	}
	signature.push('(');
	if (node.parameters) {
		let first = true;
		for (const param of node.parameters.map((node) => getFullParameterSignature(node, nodeById))) {
			if (!first) {
				signature.push(', ');
			}
			signature.push(param);
			first = false;
		}
	}
	signature.push(')');

	if (node.type) {
		if (node.name === '__call' || node.name === '__type') {
			signature.push(' => ', typeNodeToMarkup(node.type, nodeById));
		} else {
			signature.push(': ', typeNodeToMarkup(node.type, nodeById));
		}
	}

	return signature;
}

function getFullParameterSignature(node: DocumentationNode, nodeById: Map<number, DocumentationNode>): Markup {
	let name = node.name;
	if (node.flags.isOptional) {
		name += '?';
	}
	if (node.type) {
		return [name + ': ', typeNodeToMarkup(node.type, nodeById)];
	}

	return [name];
}

function renderNodeName(node: DocumentationNode, nodeById: Map<number, DocumentationNode>): AurumElement {
	const markup: Array<string | AurumElement> = [];
	if (node.extendedTypes) {
		const extend: DocumentationNodeReference[] = [];
		const implement: DocumentationNodeReference[] = [];
		for (const ext of node.extendedTypes) {
			if (nodeById.get(ext.id).kind === node.kind) {
				extend.push(ext);
			} else {
				implement.push(ext);
			}
		}
		if (extend.length) {
			markup.push(' extends ');
			let first = true;
			for (const ext of extend) {
				if (!first) {
					markup.push(', ');
				}
				markup.push(<a href={linkFactory(ext.name)}>{ext.name}</a>);
				first = false;
			}
		}
		if (implement.length) {
			markup.push(' implements ');
			let first = true;
			for (const ext of implement) {
				if (!first) {
					markup.push(', ');
				}
				markup.push(<a href={linkFactory(ext.name)}>{ext.name}</a>);
				first = false;
			}
		}
	}

	return (
		<span>
			{getFullNodeName(node)} {markup}
		</span>
	);
}

function getFullNodeName(node: DocumentationNode): string {
	let name: string = node.name;
	if (node.typeParameter) {
		name += '<';
		name += node.typeParameter.map((p) => p.name).join(', ');
		name += '>';
	}

	return name;
}
