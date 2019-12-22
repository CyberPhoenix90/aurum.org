Tranclusion is where you take child elements given to your functional component and you use them in a way usually rendering them in a specific spot. Transclusion is a great tool to make semantic HTML and is used in such cases like the builtin [Switch](#/getting_started/switches), [Router](#/getting_started/router) and [Suspense](#/getting_started/suspense) components

#### Basics of transclusion

```
function MyComponent(props, children) {
    return <div>{children}</div>
}
```

This takes the children given to MyComponent and renders them inside a div. This will work nicely no matter what is passed to MyComponent even null

#### Simple multi-transclusion

```
function Listify(props, children) {
    // If no children are received, default to an empty array
    children = children ?? [];

    return <ul>{children.map(c => <li>{c}</li>)}</ul>
}
```

In this example listify will wrap all children individually in a \<li> within an \<ul>. This requires to validate that children are passed at all.

#### Use transclusion to extend what aurum can render

Using transclusion you can give aurum support for new types of renderables

```
function FunctionRenderer(props, children) {
    return children.map((child) => typeof child === 'function'? child.toString() : child);
}

<div>
    <FunctionRenderer>
    {function() {
        console.log('hello world')
    }}
    </FunctionRenderer>
</div>

```
With this you can now render functions directly in JSX. Using data sources in your component you could make new types of dynamically updating objects that you can just render

#### Understanding buildRenderableFromModel

##### 1. Lazy loaded JSX elements
In Aurum all JSX elements are rendered lazily. This means that in your functional components the children that come from a JSX notation such as \<div></div> or \<MyComponent></MyComponent> are not actually rendered yet. They are just a model containing information needed to render it.
This means it is possible to create custom components that only selectively render children but it also means that if you want to access the real rendered content inside the component you have to call buildRenderableFromModel to render it on the spot.

##### 2. Using buildRenderableFromModel
buildRenderableFromModel is a function provided by Aurum. In your component you can either return the model or the already rendered content directly Aurum can deal with both.
buildRenderableFromModel can accept any object, it will return anything unchanged that isn't a model for an aurum node.

##### 3. Use cases
Reasons you might want to render the elements on the spot: You want to access the API of the [AurumElements](#/documentation/AurumElement) directly or to validate the type of children to only allow certain types in your component or to process custom renderable types that were returned by a JSX notation Component.

Note that when using the {someValue} notation (as in \<div>{someValue}\</div>). The value does not render lazily, it gets passed as is to the component in the children array. 


#### Advanced transclusion

Example of using all the above features for semantic HTML:
```
const switchCaseIdentity = Symbol('switchCase');

function Switch(props, children) {
    //Render the children, otherwise you only have access to their JSX model
	children = children.map(buildRenderableFromModel);
	if (children.some((c) => !c[switchCaseIdentity])) {
		throw new Error('Switch only accepts SwitchCase as children');
	}

    //Map the data source so to always update the DOM to match the wanted state
	return props.state.unique().map((state) => selectCase(state, children));
}

function selectCase(state, children) {
	return children.find((c) => c.value === state)?.content;
}

function SwitchCase(props, children) {
	return {
		[switchCaseIdentity]: true,
		content: children,
		value: props.when
	};
}

```

Usage:

```
<Switch state={someDataSource}>
    <SwitchCase when="1"><div>HTML Branch when value is one</div></SwitchCase>
    <SwitchCase when="2"><div>HTML Branch when value is two</div></SwitchCase>
</Switch>
```
This will automatically rerender when someDataSource changes and only the branch that is currently needed is rendered. This is how the builtin [Switch](#/getting_started/switches) component is implemented