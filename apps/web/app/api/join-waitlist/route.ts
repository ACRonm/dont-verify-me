import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { WelcomeEmail } from "../../../components/emails/WelcomeEmail";

const resend = new Resend(process.env.RESEND_API_KEY);
const audienceId = "46a30a4a-ccd6-442c-a577-e5cff9dcf408";

export async function POST(req: NextRequest) {
	try {
		const { email } = await req.json();

		if (!email || typeof email !== "string") {
			return NextResponse.json({ error: "Email is required" }, { status: 400 });
		}

		await resend.contacts.create({
			audienceId,
			email,
		});

		await resend.emails.send({
			from: "Dont Verify Me <noreply@dontverifyme.app>",
			to: email,
			subject: "Welcome to the Dont Verify Me Waitlist!",
			react: WelcomeEmail({ email }),
		});

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error: any) {
		console.error("Error in join-waitlist API route:", error);
		const errorMessage = error.message || "Something went wrong";
		return NextResponse.json(
			{ error: `Failed to send email: ${errorMessage}` },
			{ status: 500 }
		);
	}
}
