import { Aurum } from 'aurumjs';

export function Navbar() {
	return (
		<nav class="light-blue lighten-1" role="navigation">
			<div class="nav-wrapper container">
				<ul class="right hide-on-med-and-down">
					<li>
						<div class="title">
							<a href="#">Home</a>
						</div>
					</li>
					<li>
						<a target="_blank" href="https://github.com/CyberPhoenix90/aurum">
							Github
						</a>
					</li>
					<li>
						<a target="_blank" href="https://www.npmjs.com/package/aurumjs">
							Npm
						</a>
					</li>
				</ul>

				<ul id="nav-mobile" class="sidenav">
					<li>
						<a target="_blank" href="https://github.com/CyberPhoenix90/aurum">
							Github
						</a>
					</li>
					<li>
						<a target="_blank" href="https://www.npmjs.com/package/aurumjs">
							Npm
						</a>
					</li>
				</ul>
				<a href="#" data-target="nav-mobile" class="sidenav-trigger">
					<i class="material-icons">menu</i>
				</a>
			</div>
		</nav>
	);
}
