import Link from "next/link";

export default function Page() {
	return (
		<div style={{ maxWidth: 900, margin: '2rem auto', padding: '1rem', lineHeight: 1.6 }}>
			<Link href="/">&lt; Back to Home</Link>
			<h1 style={{ marginBottom: '0.75rem' }}>User Guide — EV Charging Queue</h1>
			<div className="h-screen">
				<iframe
					src="/User guide for EV charging Q.pdf"
					width="100%"
					height="100%"
					title="PDF Viewer"
				/>
			</div>
		</div>
	);
}
