export function LogoDots({ size = 80 }: { size?: number }) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 280 80"
			xmlns="http://www.w3.org/2000/svg"
			role="img"
			aria-label="Loading"
		>
			<defs>
				<radialGradient id="outerGradient1" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#e8f9e6" stopOpacity="0.3" />
					<stop offset="70%" stopColor="#c8eec4" stopOpacity="0.5" />
					<stop offset="100%" stopColor="#a8e39f" stopOpacity="0.7" />
				</radialGradient>
				<radialGradient id="outerGradient2" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#e8f9e6" stopOpacity="0.3" />
					<stop offset="70%" stopColor="#c8eec4" stopOpacity="0.5" />
					<stop offset="100%" stopColor="#a8e39f" stopOpacity="0.7" />
				</radialGradient>
				<radialGradient id="outerGradient3" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#e8f9e6" stopOpacity="0.3" />
					<stop offset="70%" stopColor="#c8eec4" stopOpacity="0.5" />
					<stop offset="100%" stopColor="#a8e39f" stopOpacity="0.7" />
				</radialGradient>
			</defs>
			{/* First dot */}
			<g>
				<circle cx="50" cy="40" r="30" fill="url(#outerGradient1)" />
				<circle cx="50" cy="40" r="20" fill="#75dd62" />
			</g>
			{/* Second dot */}
			<g>
				<circle cx="140" cy="40" r="30" fill="url(#outerGradient2)" />
				<circle cx="140" cy="40" r="20" fill="#75dd62" />
			</g>
			{/* Third dot */}
			<g>
				<circle cx="230" cy="40" r="30" fill="url(#outerGradient3)" />
				<circle cx="230" cy="40" r="20" fill="#75dd62" />
			</g>{" "}
			<style>
				{`
					@keyframes pulse {
						0%, 100% { opacity: 1; }
						50% { opacity: 0.5; }
					}
					circle {
						animation: pulse 1.5s ease-in-out infinite;
					}
					g:nth-child(2) circle {
						animation-delay: 0.2s;
					}
					g:nth-child(3) circle {
						animation-delay: 0.4s;
					}
				`}
			</style>
		</svg>
	);
}
