import { Aurum } from 'aurumjs';

export function Advantages() {
	return (
		<div class="container">
			<div class="section">
				<div class="row">
					<div class="col s12 m4">
						<div class="icon-block">
							<h2 class="center light-blue-text">
								<i class="material-icons">flash_on</i>
							</h2>
							<h5 class="center">Lightning fast</h5>

							<p class="light">
								Aurum.js does not waste time deciding what needs to render, instead the library has been designed in a way that figuring out
								what needs to be rendered is almost free, giving you near native performance without the hassle of manual dom updates
							</p>
						</div>
					</div>

					<div class="col s12 m4">
						<div class="icon-block">
							<h2 class="center light-blue-text">
								<i class="material-icons">query_builder</i>
							</h2>
							<h5 class="center">Small learning curve</h5>

							<p class="light">Aurum.js has very few concepts and a small API, you can get a full understanding of Aurum.js in record time.</p>
						</div>
					</div>

					<div class="col s12 m4">
						<div class="icon-block">
							<h2 class="center light-blue-text">
								<i class="material-icons">settings</i>
							</h2>
							<h5 class="center">Write less do more</h5>

							<p class="light">
								Aurum.js is very concise, you declare in one go how your view looks like and how it interacts with your data. No complicated
								data management needed.
							</p>
						</div>
					</div>
				</div>
			</div>
			<br></br>
		</div>
	);
}