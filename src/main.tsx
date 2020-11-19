import { Aurum, AurumRouter, DefaultRoute, EventEmitter, Route } from 'aurumjs';
import '../scss/main.scss';
import { Advantages } from './components/advantages';
import { Examples } from './components/examples';
import { MainTitle } from './components/main_title';
import { Navbar } from './components/navbar';
import { DocumentationPage } from './components/pages/documentation_page';
import { GettingStarted } from './components/pages/getting_started';
declare const M: any;


//@ts-ignore
r.config({ paths: { vs: 'node_modules/monaco-editor/min/vs' } });

Aurum.attach(
	<div onAttach={() => setTimeout(() => M.AutoInit())}>
		<Navbar></Navbar>
		<AurumRouter>
			<Route href="/documentation">
				<DocumentationPage></DocumentationPage>
			</Route>
			<Route href="/getting_started">
				<GettingStarted></GettingStarted>
			</Route>
			<DefaultRoute>
				<div>
					<MainTitle></MainTitle>
					<Advantages></Advantages>
					<div class="container">
						<Examples></Examples>
					</div>
				</div>
			</DefaultRoute>
		</AurumRouter>
	</div>,
	document.body
);
