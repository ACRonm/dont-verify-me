import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Text,
} from "@react-email/components";

interface WelcomeEmailProps {
	email: string;
}

const main = {
	backgroundColor: "#ffffff",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
	margin: "0 auto",
	padding: "20px 0 48px",
};

const heading = {
	fontSize: "28px",
	fontWeight: "bold",
	marginTop: "48px",
};

const text = {
	margin: "0 0 24px",
	fontSize: "16px",
	lineHeight: "24px",
};

const btn = {
	backgroundColor: "#ff6600",
	borderRadius: "4px",
	color: "#fff",
	fontSize: "16px",
	textDecoration: "none",
	textAlign: "center" as const,
	display: "block",
	padding: "12px 24px",
};

export function WelcomeEmail({ email }: Readonly<WelcomeEmailProps>) {
	return (
		<Html>
			<Head />
			<Preview>Welcome to the Dont Verify Me Waitlist!</Preview>
			<Body style={main}>
				<Container style={container}>
					<Heading style={heading}>
						Welcome to the Dont Verify Me Waitlist!
					</Heading>
					<Text style={text}>
						Thank you for signing up, {email}. We&apos;re excited to have you on
						board.
					</Text>
					<Text style={text}>
						We are working hard to bring you the best resources for bypassing
						Australian social media age verification to maintain your privacy.
						You&apos;ll be the first to know when we launch.
					</Text>
					<Button style={btn} href="https://dontverify.me">
						Visit our Website
					</Button>
					<Text style={{ ...text, marginTop: "24px" }}>
						Stay private and stay safe!
						<br />- The Dont Verify Me Team
					</Text>
				</Container>
			</Body>
		</Html>
	);
}
