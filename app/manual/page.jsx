
export default function Page() {
	return (
		<div style={{ maxWidth: 900, margin: '2rem auto', padding: '1rem', lineHeight: 1.6 }}>
			<h1 style={{ marginBottom: '0.75rem' }}>User Guide — EV Charging Queue</h1>

			<p style={{ marginBottom: '1rem' }}>
				This short guide explains how to use the web app to view and manage EV charging slots.
				Follow the Quick Start below to get going, then read the step-by-step usage and troubleshooting
				sections as needed.
			</p>

			<section style={{ marginBottom: '1rem' }}>
				<h2>Quick Start</h2>
				<ol>
					<li>Run the app locally: <code>npm install</code> then <code>npm run dev</code>.</li>
					<li>Open your browser at <strong>http://localhost:3000</strong>.</li>
					<li>Go to the Slots page to view available charging slots (the homepage).</li>
					<li>Tap or click a slot card to reserve or release it.</li>
				</ol>
			</section>

			<section style={{ marginBottom: '1rem' }}>
				<h2>Using the App — Step by Step</h2>
				<ol>
					<li>
						Browse slots: The main view shows all charging slots. Each slot card shows the name, current
						status (Available / Reserved) and any short notes.
					</li>
					<li>
						Reserve a slot: Click the <strong>Reserve</strong> button on a slot card. The card will update
						to show it is reserved and the action will be disabled for other users if realtime sync is enabled.
					</li>
					<li>
						Release a slot: If you previously reserved a slot, click <strong>Release</strong> to free it.
						Released slots become available immediately.
					</li>
					<li>
						Real-time behavior: When Firebase (or another realtime backend) is configured, changes
						sync instantly across connected clients. Without backend enabled, changes are local to
						your browser and will be lost on refresh.
					</li>
				</ol>
			</section>

			<section style={{ marginBottom: '1rem' }}>
				<h2>Important Notes</h2>
				<ul>
					<li>Reservations are not time-limited by the UI — ensure users agree on local policies.</li>
					<li>Use the Firebase integration for persistence and multi-user synchronization.</li>
					<li>The app is responsive and should work on phones and tablets; use touch-friendly taps for actions.</li>
				</ul>
			</section>

			<section style={{ marginBottom: '1rem' }}>
				<h2>Configure Firebase (optional)</h2>
				<p>
					To enable persistent, real-time updates across users, add your Firebase configuration in
					<a href="/lib/firebase.js"> the project's <strong>lib/firebase.js</strong></a> file or
					configure it to read from environment variables. After adding config, restart the dev server.
				</p>
			</section>

			<section style={{ marginBottom: '1rem' }}>
				<h2>Troubleshooting</h2>
				<ul>
					<li>
						<strong>App won't start:</strong> Run <code>npm install</code>, check Node version, then
						<code>npm run dev</code> and read the terminal errors.
					</li>
					<li>
						<strong>Slots don't persist:</strong> Firebase is not configured — by default the app uses
						static data in <a href="/data/slots.js">data/slots.js</a>.
					</li>
					<li>
						<strong>Realtime errors:</strong> If realtime sync fails, check your Firebase credentials,
						network, and browser console for messages.
					</li>
				</ul>
			</section>

			<section style={{ marginBottom: '1rem' }}>
				<h2>FAQ</h2>
				<ul>
					<li>
						<strong>Who can reserve a slot?</strong> Any user of the web app. If you need authentication,
						consider extending the app with Firebase Auth.
					</li>
					<li>
						<strong>Can reservations expire?</strong> Not currently. You can add a timer or server-side
						policy to auto-release slots.
					</li>
				</ul>
			</section>

			<section>
				<h2>Support</h2>
				<p>
					For issues or feature requests, open an issue in the repository or contact the maintainer.
					If you'd like, I can add a link to this manual in the site's layout — tell me where you'd
					like it to appear.
				</p>
			</section>
		</div>
	);
}
