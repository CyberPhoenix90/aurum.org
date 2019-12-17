import { Aurum, AurumRouter } from 'aurumjs';
import '../scss/main.scss';
import { Advantages } from './components/advantages';
import { Examples } from './components/examples';
import { MainTitle } from './components/main_title';
import { Navbar } from './components/navbar';
import { GettingStarted } from './components/pages/getting_started';
declare const M: any;

//@ts-ignore
r.config({ paths: { vs: 'node_modules/monaco-editor/min/vs' } });

Aurum.attach(
	<div onAttach={() => setTimeout(() => M.AutoInit())}>
		<Navbar></Navbar>
		<AurumRouter>
			<template ref="/getting_started" generator={() => <GettingStarted></GettingStarted>}></template>
			<template
				generator={() => (
					<div>
						<MainTitle></MainTitle>
						<Advantages></Advantages>
						<div class="container">
							<Examples></Examples>
						</div>
					</div>
				)}
			></template>
		</AurumRouter>
	</div>,
	document.body
);
